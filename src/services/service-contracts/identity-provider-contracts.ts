import { UserRepository } from "../../repositories/user-repository";

export interface IIdentityProvider {
    userRepository: UserRepository
    loginUser(loginUserRequest: LoginUserRequest): Promise<LoginUserResponse>;
    signupUser(signupUserRequest: SignupUserRequest): Promise<SignupUserResponse>;
}

export class LoginUserRequest {
    email;
    password;
}

export class LoginUserResponse {
    authenticated: boolean= false;
    token: string= null;
}

export class SignupUserRequest {
    email;
    password;
    firstName;
    lastName;
}

export class SignupUserResponse {
    authenticated: boolean= false;
    token: string= null;
}

