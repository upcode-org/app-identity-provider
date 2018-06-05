import { Request, Response } from 'express';
import { AwilixContainer } from 'awilix';
import { IdentityProvider } from '../services/identity-provider'; 
import { LoginUserResponse, LoginUserRequest } from '../service-contracts/identity-provider-contracts';

type RequestWithContainer = Request & {container: AwilixContainer};

//========== ROUTE HANDLER ==============

export const login = (req: RequestWithContainer, res: Response): Response => {
    
    console.log('==== POST/login ====');
    console.log( "req body", req.body);
    
    const username = req.body.username;
    const password = req.body.password;

    const loginRequest = new LoginUserRequest(username, password);
    const identityProvider: IdentityProvider = req.container.resolve('IdentityProvider');

    const response: LoginUserResponse = identityProvider.loginUser(loginRequest);

    const status = response.authenticated ? 200 : 401;

    return res.status(status).json(response);
}

//========== ROUTE HANDLER ==============