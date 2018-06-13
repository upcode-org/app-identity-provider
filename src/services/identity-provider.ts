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

var cert = readFileSync('.config/private_key_06-10-18.key');

export class IdentityProvider implements IIdentityProvider {

    userRepository: UserRepository

    constructor(userRepository){
        this.userRepository = userRepository;
    }
    
    loginUser(loginUserRequest: LoginUserRequest): Promise<LoginUserResponse> {
        let loginUserResponse = new LoginUserResponse();

        return this.userRepository.getUserByEmail(loginUserRequest.email)
            .then( async (user) => {
                if( user && await this.doesPasswordMatch(loginUserRequest.password, user.password) ) {
                    const token = sign({ email: loginUserRequest.email, extra: 'some extra claims'}, cert, {algorithm: 'RS256'});
                    loginUserResponse.authenticated = true;
                    loginUserResponse.token = token;
                    return loginUserResponse;
                }
                return loginUserResponse;
            });
    }

    async signupUser(signupUserRequest: SignupUserRequest): Promise<SignupUserResponse> {
        let signupUserResponse = new SignupUserResponse();
        let hash;

        try {
            if( await this.isUserRegistered(signupUserRequest.email) ) {
                signupUserResponse.validationError = 'User is already registered';
                return signupUserResponse;
            }
        }catch(err) {
            throw err;
        }

        try {
            hash = await this.hashPassword(signupUserRequest.password);
        }catch(err) {
            throw err;
        }

        const newUser = {
            "email": signupUserRequest.email,
            "password": hash,
            "first_name": signupUserRequest.firstName,
            "last_name": signupUserRequest.lastName
        }
        
        return this.userRepository.createUser(newUser)
            .then((createdUser) => {
                if(!createdUser) throw new Error('could not create user');
                const token = sign({ username: createdUser.username, extra: 'some extra claims'}, cert, {algorithm: 'RS256'});
                signupUserResponse.authenticated = true;
                signupUserResponse.token = token;
                return signupUserResponse;
            });
    }

    private isUserRegistered(email): Promise<boolean> {
        return this.userRepository.getUserByEmail(email)
            .then( doc => {
                if(!doc) return false
                return true
            })
    }

    private hashPassword(password): Promise<string> {
        return bcrypt.hash(password, 10)
            .then( hash => hash )
            .catch( err => {throw err});
    }

    private doesPasswordMatch(password, hash): Promise<boolean> { 
        return bcrypt.compare(password, hash)
            .then( verdict => verdict )
            .catch( err => {throw err});
    }

}

