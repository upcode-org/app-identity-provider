import { LoginUserResponse, LoginUserRequest } from "../services/service-contracts/identity-provider-contracts";
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from "../repositories/user-repository";

var cert = fs.readFileSync('.config/private1.key');

export class IdentityProvider {

    userRepository: UserRepository

    constructor(opts){
        this.userRepository = opts.userRepository;
    }
    
    loginUser(loginRequest: LoginUserRequest): Promise<LoginUserResponse> {
        
        let loginUserResponse = new LoginUserResponse();
        
        return this.userRepository.getUserByUsername(loginRequest.username)
            .then((user) => {
                if( user && user.password === loginRequest.password ) {
                    const token = jwt.sign({ username: loginRequest.username, extra: 'some extra claims'}, cert, {algorithm: 'RS256'});
                    loginUserResponse.authenticated = true;
                    loginUserResponse.token = token;
                    return loginUserResponse;
                }
                
                return loginUserResponse
            });
    }

    signupUser(){

    }
}

// if( user && user.password === loginRequest.password ) {
//     console.log(x.car)
//     const token = jwt.sign({ username: loginRequest.username, extra: 'some extra claims'}, cert, {algorithm: 'RS256'});
//     loginUserResponse.authenticated = true;
//     loginUserResponse.token = token;
//     return loginUserResponse;

// }else {
//     return loginUserResponse
// }