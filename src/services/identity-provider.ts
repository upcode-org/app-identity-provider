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
import { ArchivingService } from './archiving-service';

var cert = readFileSync('.config/private_key_06-10-18.key');

export class IdentityProvider implements IIdentityProvider {

    userRepository: UserRepository
    archivingService: ArchivingService

    constructor(userRepository, archivingService){
        this.userRepository = userRepository;
        this.archivingService = archivingService;
    }
    
    loginUser(loginUserRequest: LoginUserRequest): Promise<LoginUserResponse> {
        let loginUserResponse = new LoginUserResponse();

        return this.userRepository.getUserByEmail(loginUserRequest.email)
            .then( async (user) => {
                if( user && await this.doesPasswordMatch(loginUserRequest.password, user.password) ) {
                    const token = sign({ email: loginUserRequest.email, extra: 'some extra claims'}, cert, {algorithm: 'RS256'});
                    loginUserResponse.authenticated = true;
                    loginUserResponse.token = token;
                    this.archiveEvent(user.email, 'loginUser');
                    return loginUserResponse;
                }
                // credentials not authenticated
                return loginUserResponse;
            });
    }

    async signupUser(signupUserRequest: SignupUserRequest): Promise<SignupUserResponse> {
        let signupUserResponse = new SignupUserResponse();
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
            "sign_up_date_tzo": now.getTimezoneOffset() 
        }
        
        return this.userRepository.createUser(newUser)
            .then((createdUser) => {
                const token = sign({ username: createdUser.email, extra: 'some extra claims'}, cert, {algorithm: 'RS256'});
                //user should not be authenticated upon signup, they need to verify first
                signupUserResponse.authenticated = false;
                signupUserResponse.token = token;
                this.archiveEvent(createdUser.email, 'signupUser');
                return signupUserResponse;
            });
    }

    private hashPassword(password): Promise<string> {
        return bcrypt.hash(password, 10)
            .then( hash => hash );
    }

    private doesPasswordMatch(password, hash): Promise<boolean> { 
        return bcrypt.compare(password, hash)
            .then( verdict => verdict );
    }

    private archiveEvent(eventPayload: string, eventName: string): void {
        let event = { eventPayload, eventName };
        this.archivingService.archiveEvent(event);
    }

}

