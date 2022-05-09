import express, { Request, Response } from 'express';
import apicache from 'apicache';
const apiRoutes = express.Router();

import advancedResults from '../../app/middlewares/advancedResults';
import { protect } from '../../app/middlewares/auth';
import fileHandler from '../../app/middlewares/fileHandler';
import validate from '../../app/middlewares/validator';

// add api routes below
import authRouter from './modules/auth';
import guestRouter from './modules/guest';

apiRoutes.use(advancedResults);
apiRoutes.use(fileHandler);
apiRoutes.use(validate);

// initialize routes
apiRoutes.use('/', guestRouter);
apiRoutes.use('/', protect, authRouter);

export default apiRoutes;
