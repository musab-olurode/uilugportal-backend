import express from 'express';
import {
	destroy,
	index,
	store,
	update,
} from '../../../../app/controllers/resource';

const router = express.Router();

router.route('/').get(index).post(store);
router.route('/:resourceId').put(update).delete(destroy);

export default router;
