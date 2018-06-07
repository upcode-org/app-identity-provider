import { Request, Response } from 'express';
import { AwilixContainer } from 'awilix';
import { IdentityProvider } from '../../../services/identity-provider'; 
import { LoginUserResponse, LoginUserRequest } from '../../../services/service-contracts/identity-provider-contracts';

type RequestWithContainer = Request & {container: AwilixContainer};

export const login =  (req: RequestWithContainer, res: Response): Promise<Response> => {
    
    const username = req.body.username;
    const password = req.body.password;
    const loginUserRequest = new LoginUserRequest(username, password);
    
    const identityProvider: IdentityProvider = req.container.resolve('IdentityProvider');
    
    return identityProvider.loginUser(loginUserRequest)
        .then( loginUserResponse => {
            const status = loginUserResponse.authenticated ? 200 : 401;
            return res.status(status).json(loginUserResponse);
        })
        .catch( err => {
            return res.status(500).json(err && err.stack ? err.stack : 'Internal Server Error');
        })

}
