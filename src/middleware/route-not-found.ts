import { Request, Response, NextFunction } from 'express';
import { AwilixContainer } from 'awilix';

type RequestWithContainer = Request & {container: AwilixContainer};

export const routeNotFoundHandler = (req: RequestWithContainer, res: Response, next: NextFunction) => {
    
    res.status(404).json({
        message: "I got nothing!"
    })
}