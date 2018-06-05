import { Request, Response, NextFunction } from 'express';
import { container } from '../../composition-root';
import { AwilixContainer } from 'awilix';

export const attachContainer = (req: Request, res: Response, next: NextFunction) => {
    console.log('====Container Attached====');
    console.log('request from: ', req.headers['user-agent']);

    req['container'] = container.createScope();
    return next();
}