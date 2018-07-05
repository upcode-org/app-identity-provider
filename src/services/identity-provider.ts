import { readFileSync } from 'fs';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../repositories/user-repository';
import {
    IIdentityProvider,
    LoginUserRequest,
    LoginUserResponse,
    SignupUserRequest,
    SignupUserResponse,
} from '../services/service-contracts/identity-provider-contracts';
//import { ArchivingService } from './archiving-service';
import { VerificationEmailProducer } from './verification-email-producer';
import { MonitoringService } from './monitoring-service';

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
    
    loginUser(loginUserRequest: LoginUserRequest): Promise<LoginUserResponse> {
        let loginUserResponse = new LoginUserResponse();

        return this.userRepository.getUserByEmail(loginUserRequest.email)
            .then( async (user) => {
                if( user && user.verified && await this.doesPasswordMatch(loginUserRequest.password, user.password) ) {
                    const token = sign({ email: loginUserRequest.email, extra: 'some extra claims'}, cert, {algorithm: 'RS256'});
                    loginUserResponse.authenticated = true;
                    loginUserResponse.token = token;
                    return loginUserResponse;
                }
                // credentials not authenticated
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

    verifyUser(userId) {
        return this.userRepository.updateUserVerification(userId);
    }

    private sendToEmailQueue(createdUser): void {
        
        const msg = { 
            "userId": createdUser._id, 
            "email": createdUser.email, 
            "firstName": createdUser.first_name,
            "lastName": createdUser.last_name
        }

        this.verificationEmailProducer.produceMsg(msg)
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

