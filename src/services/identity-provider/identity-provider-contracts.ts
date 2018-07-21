export interface IIdentityProvider {
    loginUser(loginUserRequest: LoginUserRequest): Promise<LoginUserResponse>;
    signupUser(signupUserRequest: SignupUserRequest): Promise<SignupUserResponse>;
    verifyUser(userId: string): Promise<VerifyUserResponse>;
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

export class VerifyUserResponse {
    modifiedUser: any
}

export interface VerificationEmailMsg {
    msgTypeId: number, //1
    recipientEmail: string,
    payload: {
        "APP_IDENTITY_PROVIDER_HOST": string,
        "FIRST_NAME": string,
        "LAST_NAME": string,
        "USER_ID": string
    }
}

