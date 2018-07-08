import { Request, Response } from 'express';
import { AppContainer } from '../../../lib/container';
import { IdentityProvider } from '../../../services/identity-provider/identity-provider';
import { VerifyUserResponse } from '../../../services/identity-provider/identity-provider-contracts';
import { MonitoringService } from '../../../services/monitoring-service';

type RequestWithContainer = Request & {container: AppContainer};

export const verify = (req: RequestWithContainer, res: Response): Promise<Response> => {
    
    const processInstanceId = `002-${process.pid}-${new Date().getTime()}-${getRandomInt(1, 1000)}`;
    req.container.scopedDependency('processInstanceId', processInstanceId);

    const monitoringService: MonitoringService = req.container.get('monitoringService');
    monitoringService.log(`${req.url} received new request from ${req.connection.remoteAddress}`);
    
    const identityProvider: IdentityProvider = req.container.get('identityProvider');
    const userId = req.query.id;

    return identityProvider.verifyUser(userId)
        .then((verifyUserResponse: VerifyUserResponse) => {
            monitoringService.log(`Success: ${JSON.stringify(verifyUserResponse)}`);
            return res.status(200).json(verifyUserResponse.modifiedUser);
        })
        .catch( err => {
            monitoringService.log(err);
            return res.status(500).json(err && err.stack ? err.stack : 'Internal Server Error');
        });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}