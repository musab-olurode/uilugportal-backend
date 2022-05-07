import express from 'express';
import {
	replyToComment,
	index,
	show,
} from '../../../../app/controllers/comment';

const router = express.Router();

router.route('/').get(index);

router.get('/:commentId', show);

router.post('/:commentId/reply', replyToComment);

export default router;
