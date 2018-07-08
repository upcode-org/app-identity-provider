import { Request, Response, NextFunction } from 'express';
import { container } from '../../composition-root';

export const attachContainer = (req: Request, res: Response, next: NextFunction) => {
    req['container'] = container.getScopedContainer();
    req['container'].scopedDependency('queueName', 'app-identity-provider-process-logs');
    return next();
}
