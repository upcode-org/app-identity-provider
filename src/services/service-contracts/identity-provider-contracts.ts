export class LoginUserResponse {
    authenticated: boolean= false;
    token: string= null;
}

export class LoginUserRequest {
    constructor(private username, private password){}
}