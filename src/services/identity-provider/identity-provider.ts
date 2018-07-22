import { readFileSync } from 'fs';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../../repositories/user-repository';
import {
    IIdentityProvider,
    LoginUserRequest,
    LoginUserResponse,
    SignupUserRequest,
    SignupUserResponse,
    VerifyUserResponse,
    VerificationEmailMsg,
} from '../../services/identity-provider/identity-provider-contracts';
import { VerificationEmailProducer } from '../verification-email-producer';
import { MonitoringService } from '../monitoring-service';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import { getHost } from '../../environments/host';

const cert = readFileSync('.config/private_key_06-10-18.key');

export class IdentityProvider implements IIdentityProvider {

    userRepository: UserRepository;
    verificationEmailProducer: VerificationEmailProducer;
    monitoringService: MonitoringService;

    constructor(userRepository, verificationEmailProducer, monitoringService) {
        this.userRepository = userRepository;
        this.verificationEmailProducer = verificationEmailProducer;
        this.monitoringService = monitoringService;
    }
    
    async loginUser(loginUserRequest: LoginUserRequest): Promise<LoginUserResponse> {
        let loginUserResponse = new LoginUserResponse();

        this.monitoringService.log(`Fetching user from DB`);

        return this.userRepository.getUserByEmail(loginUserRequest.email)
            .then( async (user) => {
                if( user && user.verified && user.active && await this.doesPasswordMatch(loginUserRequest.password, user.password) ) {
                    const token = sign({ email: loginUserRequest.email, extra: 'some extra claims'}, cert, {algorithm: 'RS256'});
                    loginUserResponse.authenticated = true;
                    loginUserResponse.token = token;
                    this.monitoringService.log(`${loginUserRequest.email} authenticated.`);
                    return loginUserResponse;
                }
                // credentials not authenticated
                this.monitoringService.log(`${loginUserRequest.email} could not authenticate.`);
                return loginUserResponse;
            });
    }

    async signupUser(signupUserRequest: SignupUserRequest): Promise<SignupUserResponse> {
        
        const hash = await this.hashPassword(signupUserRequest.password);
        const now = new Date();
        
        const newUser = {
            "email": signupUserRequest.email,
            "password": hash,
            "first_name": signupUserRequest.firstName,
            "last_name": signupUserRequest.lastName,
            "verified" : false,
            "active": false,
            "sign_up_date": now,
            "sign_up_date_tzo": now.getTimezoneOffset(),
            "roles": {}
        }
        
        this.monitoringService.log(`IdentityProvider service will create new user: ${JSON.stringify(newUser)}`);
        let signupUserResponse = new SignupUserResponse();
        
        return this.userRepository.createUser(newUser)
            .then((createdUser) => {
                this.monitoringService.log(`IdentityProvider created new user: ${JSON.stringify(createdUser)}`)

                this.sendToEmailQueue(createdUser);
                
                const token = sign({ username: createdUser.email, extra: 'some extra claims'}, cert, {algorithm: 'RS256'});
                signupUserResponse.token = token;
                return signupUserResponse;
            });
    }

    async verifyUser(userId: string): Promise<VerifyUserResponse> {
        this.monitoringService.log(`User with id ${userId} requested to be verified.`)

        const  response = new VerifyUserResponse();
        const result: FindAndModifyWriteOpResultObject = await this.userRepository.updateUserVerification(userId);
        
        if(result.ok !== 1 || result.value === null ) throw new Error('Could not update user');
        if(result.ok === 1 ) response.modifiedUser = result.value;
        
        this.monitoringService.log(`User with id ${userId} successfully verified.`)
        return response;
    }

    private sendToEmailQueue(createdUser): void {
        
        const msg: VerificationEmailMsg = { 
            msgTypeId: 1,
            recipientEmail: createdUser.email,
            processInstanceId: this.monitoringService.processInstanceId,
            payload: {
                "APP_IDENTITY_PROVIDER_HOST": getHost(process.env.NODE_ENV), 
                "FIRST_NAME": createdUser.first_name,
                "LAST_NAME": createdUser.last_name,
                "USER_ID": createdUser._id, 
            }
        }

        this.monitoringService.log(`Sending a verification email to ${createdUser.email}`)
        this.verificationEmailProducer.produceMsg(msg);
    }

    private hashPassword(password): Promise<string> {
        return bcrypt.hash(password, 10)
            .then( hash => hash );
    }

    private doesPasswordMatch(password, hash): Promise<boolean> { 
        return bcrypt.compare(password, hash)
            .then( verdict => verdict );
    }

}

