import express from 'express';
import {
	calculateCGPA,
	getAllPrintables,
	getResult,
} from '../../../../app/controllers/user';

const router = express.Router();

router.get('/results', getResult);
router.get('/results/calculate-cgpa', calculateCGPA);
router.get('/printables', getAllPrintables);

export default router;
