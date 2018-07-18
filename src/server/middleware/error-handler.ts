import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../../services/monitoring-service';
import { AppContainer } from 'src/lib/container';

type RequestWithContainer = Request & { container: AppContainer };

export const errorHandler = (err: Error, req: RequestWithContainer, res: Response, next: NextFunction) => {

    if(req.container) {
        const monitoringService: MonitoringService = req.container.get('monitoringService');
        monitoringService.log(err);
    }
    
    res.status(500).json({
        message: err.stack ? err.stack : 'Internal Server error'
    });
}