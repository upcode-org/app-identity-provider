import { Request, Response } from 'express';
import { AppContainer } from '../../../../lib/container';
import { IdentityProvider } from '../../../services/identity-provider';
import { SignupUserRequest, SignupUserResponse } from '../../../services/service-contracts/identity-provider-contracts';
import { MongoError } from 'mongodb';

type RequestWithContainer = Request & {container: AppContainer};

export const signup = (req: RequestWithContainer, res: Response): Promise<Response> => {
    
    let signupUserRequest = new SignupUserRequest();

    signupUserRequest.email = req.body.email;
    signupUserRequest.firstName = req.body.firstName;
    signupUserRequest.lastName = req.body.lastName;
    signupUserRequest.password = req.body.password

    const identityProvider: IdentityProvider = req.container.get('identityProvider');
    
    return identityProvider.signupUser(signupUserRequest)
        .then((signupUserResponse: SignupUserResponse) => {
            const status = signupUserResponse.authenticated ? 200 : 401;
            return res.status(status).json(signupUserResponse);
        })
        .catch( err => {
            const status = err.code === 1 ? 422 : 500;
            return res.status(status).json(err && err.stack ? err.stack : 'Internal Server Error');
        });
}