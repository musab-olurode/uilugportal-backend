import express from 'express';
import {
	destroy,
	index,
	store,
	update,
} from '../../../../app/controllers/assignment';

const router = express.Router();

router.route('/').get(index).post(store);
router.route('/:assignmentId').put(update).delete(destroy);

export default router;
