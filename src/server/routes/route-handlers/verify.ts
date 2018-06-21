import { Request, Response } from 'express';
import { AppContainer } from '../../../../lib/container';
import { IdentityProvider } from '../../../services/identity-provider';
import { FindAndModifyWriteOpResultObject } from 'mongodb';

type RequestWithContainer = Request & {container: AppContainer};

export const verify = (req: RequestWithContainer, res: Response): Promise<Response> => {
    
    const identityProvider: IdentityProvider = req.container.get('identityProvider');
    const userId = req.query.id;

    return identityProvider.verifyUser(userId)
        .then((result: FindAndModifyWriteOpResultObject) => {
            return res.status(200).json(result.value);
        })
        .catch( err => {
            return res.status(500).json(err && err.stack ? err.stack : 'Internal Server Error');
        });
}