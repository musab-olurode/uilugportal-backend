import express, { Request, Response } from 'express';
import apicache from 'apicache';
const authRoutes = express.Router();

// caching
const cache = apicache.middleware;
const onlyStatus200 = (req: Request, res: Response) => res.statusCode === 200;
authRoutes.use(cache('5 minutes', onlyStatus200));

// add api routes below
import authRouter from './auth';
import userRouter from './user';
import postRouter from './post';
import commentRouter from './comment';
import newsRouter from './news';

// initialize routes
authRoutes.use('/auth', authRouter);
authRoutes.use('/user', userRouter);
authRoutes.use('/posts', postRouter);
authRoutes.use('/comments', commentRouter);
authRoutes.use('/news', newsRouter);

export default authRoutes;
