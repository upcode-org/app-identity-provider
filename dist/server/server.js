"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routes_1 = require("./routes/routes");
const attach_container_1 = require("./middleware/attach-container");
const route_not_found_1 = require("./middleware/route-not-found");
const error_handler_1 = require("./middleware/error-handler");
const bodyParser = require("body-parser");
const app = express();
const port = 3088;
app.use(attach_container_1.attachContainer);
app.use(bodyParser.json());
app.use('/v1.0', routes_1.router);
app.use(route_not_found_1.routeNotFoundHandler);
app.use(error_handler_1.errorHandler);
app.listen(process.env.PORT || port, () => {
    console.log(`"Identity Provider" is serving requests on port: ${port}`);
});
//# sourceMappingURL=server.js.map