import * as express from 'express';
import { router } from './routes/routes';
import { attachContainer } from './middleware/attach-container';
import { routeNotFoundHandler } from './middleware/route-not-found';
import { errorHandler } from './middleware/error-handler';
import * as bodyParser from 'body-parser';
import { containerResolver, container } from '../composition-root';
import * as cluster from 'cluster';
import { cpus } from 'os';
import { MonitoringService } from '../services/monitoring-service';

if (false) { //cluster.isMaster
    // const n = cpus().length;

    // console.log(`Forking for ${n} CPUs`);
    
    // for (let i = 0; i<n; i++) {
    //     cluster.fork();
    // }

    // cluster.on('exit', (worker, code, signal) => {
    //     if (code !== 0 && !worker.exitedAfterDisconnect) {
    //         console.log(`Worker ${worker.id} crashed. ` + 'Starting a new worker...');
    //         setTimeout(() => {
    //             cluster.fork();
    //         },100);
    //     }
    // });

} else {
    containerResolver()
        .then((container) => {

            const monitoringService: MonitoringService = container.get('monitoringService');

            const app = express();
            const port = 3000;
            
            app.use(bodyParser.json());
            app.use(attachContainer);
            app.use('/v1.0', router);
            app.use(routeNotFoundHandler);
            app.use(errorHandler);

            const server = app.listen( process.env.PORT || port, () => {
                monitoringService.log(`"Identity Provider" is serving requests on port: ${port}`);
            });

            server.on('close', () => {
                //to do
            });

            process.on('uncaughtException', (err) => {
                monitoringService.log(`Uncaught exception: ${err}`);
                process.exit(1);
            });
        })
        .catch( err => console.log('unable to start server', err ));
}
