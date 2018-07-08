import { Request, Response } from 'express';
import { AppContainer } from '../../../lib/container';
import { IdentityProvider } from '../../../services/identity-provider/identity-provider';
import { SignupUserRequest, SignupUserResponse } from '../../../services/identity-provider/identity-provider-contracts';
import { MonitoringService } from '../../../services/monitoring-service';

type RequestWithContainer = Request & {container: AppContainer};

export const signup = (req: RequestWithContainer, res: Response): void => {
    
    const processInstanceId = `001-${process.pid}-${new Date().getTime()}-${getRandomInt(1, 1000)}`;
    req.container.scopedDependency('processInstanceId', processInstanceId);
    
    const monitoringService: MonitoringService = req.container.get('monitoringService');
    monitoringService.log(`${req.url} received new request from ${req.connection.remoteAddress}`);
    
    let signupUserRequest = new SignupUserRequest();
    signupUserRequest.email = req.body.email;
    signupUserRequest.firstName = req.body.firstName;
    signupUserRequest.lastName = req.body.lastName;
    signupUserRequest.password = req.body.password;
    
    const identityProvider: IdentityProvider = req.container.get('identityProvider');
    
    identityProvider.signupUser(signupUserRequest)
        .then((signupUserResponse: SignupUserResponse) => {
            monitoringService.log(`Success: ${JSON.stringify(signupUserResponse)}`);
            return res.status(200).json(signupUserResponse);
        })
        .catch( err => {
            monitoringService.log(err);
            const status = (err.code === 1 || err.code === 2 ) ? 422 : 500;
            return res.status(status).json(err && err.stack ? err.stack : 'Internal Server Error');
        });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}