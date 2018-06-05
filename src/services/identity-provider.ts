import { LoginUserResponse, LoginUserRequest } from "../service-contracts/identity-provider-contracts";

export class IdentityProvider {

    constructor(private userRepository){
    }
    
    loginUser(loginRequest: LoginUserRequest): LoginUserResponse {
        let response = new LoginUserResponse();

        // find user by username using the userRepository, check that password matches
        // jwt.sign 
    
        return response;
    }

    signupUser(){

    }
}

