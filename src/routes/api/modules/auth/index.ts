import express from 'express';
const authRoutes = express.Router();

// add api routes below
import authRouter from './auth';
import userRouter from './user';
import postRouter from './post';
import commentRouter from './comment';
import newsRouter from './news';
import scheduleRouter from './schedule';
import resourceRouter from './resource';
import assignmentRouter from './assignment';

// initialize routes
authRoutes.use('/auth', authRouter);
authRoutes.use('/users', userRouter);
authRoutes.use('/posts', postRouter);
authRoutes.use('/comments', commentRouter);
authRoutes.use('/news', newsRouter);
authRoutes.use('/schedules', scheduleRouter);
authRoutes.use('/resources', resourceRouter);
authRoutes.use('/assignments', assignmentRouter);

export default authRoutes;
