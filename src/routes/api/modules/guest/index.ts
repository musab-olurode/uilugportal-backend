import express from 'express';
const guestRoutes = express.Router();

// add api routes below
import authRouter from './auth';
import testRouter from './test';

// initialize routes
guestRoutes.use('/auth', authRouter);
guestRoutes.use('/test', testRouter);

export default guestRoutes;
