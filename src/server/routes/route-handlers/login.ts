import { Request, Response } from 'express';
import { IdentityProvider } from '../../../services/identity-provider/identity-provider'; 
import { LoginUserResponse, LoginUserRequest } from '../../../services/identity-provider/identity-provider-contracts';
import { AppContainer } from 'src/lib/container';
import { MonitoringService } from '../../../services/monitoring-service';

type RequestWithContainer = Request & {container: AppContainer};

export const login =  (req: RequestWithContainer, res: Response): Promise<Response> => {
    const processInstanceId = `003-${process.pid}-${new Date().getTime()}-${getRandomInt(1, 1000)}`;
    req.container.scopedDependency('processInstanceId', processInstanceId);
    
    const monitoringService: MonitoringService = req.container.get('monitoringService');
    monitoringService.log(`${req.url} received new request from ${req.connection.remoteAddress}`);
    
    const loginUserRequest = new LoginUserRequest();
    loginUserRequest.email = req.body.email;
    loginUserRequest.password = req.body.password;
    
    const identityProvider: IdentityProvider = req.container.get('identityProvider');
    
    return identityProvider.loginUser(loginUserRequest)
        .then( (loginUserResponse: LoginUserResponse) => {
            monitoringService.log(`Success: ${JSON.stringify(loginUserResponse)}`);
            const status = loginUserResponse.authenticated ? 200 : 401;
            return res.status(status).json(loginUserResponse);
        })
        .catch( err => {
            monitoringService.log(err)
            return res.status(500).json(err && err.stack ? err.stack : 'Internal Server Error');
        })
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
