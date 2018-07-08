import { Request, Response, NextFunction } from 'express';
import { AppContainer } from '../../lib/container';

type RequestWithContainer = Request & {container: AppContainer};

export const routeNotFoundHandler = (req: RequestWithContainer, res: Response, next: NextFunction) => {
    
    res.status(404).json({
        message: "I got nothing!"
    })
}