import * as express from 'express';
import { router } from './routes/routes';
import { attachContainer } from './middleware/attach-container';
import { routeNotFoundHandler } from './middleware/route-not-found';
import { errorHandler } from './middleware/error-handler';
import * as bodyParser from 'body-parser';

const app = express();
const port = 3088;

app.use(attachContainer);
app.use(bodyParser.json());
app.use('/v1.0', router);
app.use(routeNotFoundHandler);
app.use(errorHandler);

app.listen( process.env.PORT || port, () => {
    console.log(`"Identity Provider" is serving requests on port: ${port}`);
});