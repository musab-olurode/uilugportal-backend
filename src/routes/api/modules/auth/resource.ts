import express from 'express';
import {
	destroy,
	index,
	search,
	store,
	update,
} from '../../../../app/controllers/resource';

const router = express.Router();

router.route('/').get(index).post(store);
router.get('/search', search);
router.route('/:resourceId').put(update).delete(destroy);

export default router;
