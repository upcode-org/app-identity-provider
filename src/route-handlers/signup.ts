import { Request, Response } from 'express';
import { AwilixContainer } from 'awilix';

type RequestWithContainer = Request & {container: AwilixContainer};

export const signup = (req: RequestWithContainer, res: Response) => {
    
    res.status(200).json({
        message: 'signed up!'
    });
    
}