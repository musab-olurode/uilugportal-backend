import express from 'express';
import {
	comment,
	destroy,
	getComments,
	index,
	like,
	show,
	store,
} from '../../../../app/controllers/post';

const router = express.Router();

router.route('/').post(store).get(index);

router.route('/:postId').get(show).delete(destroy);

router.post('/:postId/comment', comment);

router.get('/:postId/comments', getComments);

router.post('/:postId/like', like);

export default router;
