import express from 'express';
import {
	destroy,
	getSubmittedAssignments,
	index,
	store,
	submit,
	update,
} from '../../../../app/controllers/assignment';
import { Role } from '../../../../app/helpers/enums';
import { authorize } from '../../../../app/middlewares/auth';

const router = express.Router();

router
	.route('/')
	.get(index)
	.post(authorize(Role.CLASS_REP, Role.ASST_CLASS_REP), store);
router.post('/:assignmentId/submit', submit);
router.get(
	'/submitted',
	authorize(Role.CLASS_REP, Role.ASST_CLASS_REP),
	getSubmittedAssignments
);
router.route('/:assignmentId').put(update).delete(destroy);

export default router;
