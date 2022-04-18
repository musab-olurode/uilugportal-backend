import express from 'express';
import {
	getLoggedInUser,
	signin,
	signout,
} from '../../../app/controllers/auth';
import { protect } from '../../../app/middlewares/auth';

const router = express.Router();

router.post('/signin', signin);
router.get('/me', protect, getLoggedInUser);
router.post('/signout', protect, signout);

export default router;
