import express from 'express';
import { getUserSchedules } from '../../../../app/controllers/schedule';
import {
	calculateCGPA,
	getAllPrintables,
	getResult,
} from '../../../../app/controllers/user';

const router = express.Router();

router.get('/results', getResult);
router.get('/results/calculate-cgpa', calculateCGPA);
router.get('/printables', getAllPrintables);
router.get('/:userId/schedule', getUserSchedules);

export default router;
