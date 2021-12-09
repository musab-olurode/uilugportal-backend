import express from 'express';
import {
  forgotPassword,
  getAuthUser,
  resetPassword,
  signup,
  signin,
  updatePassword,
  signout
} from '../../../app/controllers/authController';
import { protect } from '../../../app/middlewares/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', protect, getAuthUser);
router.post('/signout', protect, signout);
router.put('/update-password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

export default router;
