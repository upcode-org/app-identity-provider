import { Request, Response, NextFunction } from 'express';
import { AwilixContainer } from 'awilix';
import { MonitoringService } from '../../services/monitoring-service';
import { AppContainer } from 'lib/container';

type RequestWithContainer = Request & { container: AppContainer };

export const errorHandler = (err: Error, req: RequestWithContainer, res: Response, next: NextFunction) => {

    const monitoringService: MonitoringService = req.container.get('monitoringService');
    
    monitoringService.report(err);
    
    res.status(500).json({
        message: err.stack ? err.stack : 'Internal Server error'
    });
}