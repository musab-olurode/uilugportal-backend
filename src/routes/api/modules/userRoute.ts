import express from 'express';
import {
  calculateCGPA,
  getAllPrintables,
  getResult,
} from '../../../app/controllers/userController';
import { protect } from '../../../app/middlewares/auth';

const router = express.Router();

router.get('/results', protect, getResult);
router.get('/results/calculate-cgpa', protect, calculateCGPA);
router.get('/printables', protect, getAllPrintables);

export default router;
