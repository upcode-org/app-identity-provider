import { Request, Response, NextFunction } from 'express';
import { AwilixContainer } from 'awilix';
import { MonitoringService } from '../services/monitoring-service';

type RequestWithContainer = Request & { container: AwilixContainer };

export const errorHandler = (err: Error, req: RequestWithContainer, res: Response, next: NextFunction) => {

    const monitoringService: MonitoringService = req.container.resolve('MonitoringService');
    
    monitoringService.report(err);
    
    res.status(500).json({
        message: err.stack ? err.stack : 'Internal Server error'
    });
}