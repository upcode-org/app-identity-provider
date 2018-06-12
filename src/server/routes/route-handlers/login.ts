import { Request, Response } from 'express';
import { IdentityProvider } from '../../../services/identity-provider'; 
import { LoginUserResponse, LoginUserRequest } from '../../../services/service-contracts/identity-provider-contracts';
import { AppContainer } from 'lib/container';

type RequestWithContainer = Request & {container: AppContainer};

export const login =  (req: RequestWithContainer, res: Response): Promise<Response> => {
    
    const loginUserRequest = new LoginUserRequest();
    loginUserRequest.email = req.body.email;
    loginUserRequest.password = req.body.password;
    
    const identityProvider: IdentityProvider = req.container.get('identityProvider');
    
    return identityProvider.loginUser(loginUserRequest)
        .then( (loginUserResponse: LoginUserResponse) => {
            const status = loginUserResponse.authenticated ? 200 : 401;
            return res.status(status).json(loginUserResponse);
        })
        .catch( err => {
            return res.status(500).json(err && err.stack ? err.stack : 'Internal Server Error');
        })
}
