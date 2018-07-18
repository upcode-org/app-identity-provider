"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routes_1 = require("./routes/routes");
const attach_container_1 = require("./middleware/attach-container");
const route_not_found_1 = require("./middleware/route-not-found");
const error_handler_1 = require("./middleware/error-handler");
const bodyParser = require("body-parser");
const composition_root_1 = require("../composition-root");
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
}
else {
    composition_root_1.containerResolver()
        .then((container) => {
        const monitoringService = container.get('monitoringService');
        const app = express();
        const port = 3000;
        app.use(bodyParser.json());
        app.use(attach_container_1.attachContainer);
        app.use('/v1.0', routes_1.router);
        app.use(route_not_found_1.routeNotFoundHandler);
        app.use(error_handler_1.errorHandler);
        const server = app.listen(process.env.PORT || port, () => {
            console.log(`"Identity Provider" is serving requests on port: ${port}`);
        });
        server.on('close', () => {
            console.log('server closed!');
        });
        process.on('uncaughtException', (err) => {
            monitoringService.log(`Uncaught exception: ${err}`);
            process.exit(1);
        });
    })
        .catch(err => console.log('unable to start server', err));
}
//# sourceMappingURL=server.js.map