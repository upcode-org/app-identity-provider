import { Request, Response, NextFunction } from 'express';
import { container } from '../../composition-root';

export const attachContainer = (req: Request, res: Response, next: NextFunction) => {
    const processInstanceId = `${process.pid}-${new Date().getTime()}-${getRandomInt(1, 1000)}`;

    req['container'] = container.getScopedContainer();
    req['container'].value('processInstanceId', processInstanceId);
    req['container'].value('queueName', 'process001');
    return next();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}