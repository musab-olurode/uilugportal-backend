import express from 'express';
const authRoutes = express.Router();

// add api routes below
import authRouter from './auth';
import userRouter from './user';
import postRouter from './post';
import commentRouter from './comment';

// initialize routes
authRoutes.use('/auth', authRouter);
authRoutes.use('/user', userRouter);
authRoutes.use('/posts', postRouter);
authRoutes.use('/comments', commentRouter);

export default authRoutes;
