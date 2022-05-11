import express from 'express';
import { getUserAssignments } from '../../../../app/controllers/assignment';
import { getUserResources } from '../../../../app/controllers/resource';
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
router.get('/:userId/resources', getUserResources);
router.get('/:userId/assignments', getUserAssignments);

export default router;
