import express from 'express';
import { comment, index, show, store } from '../../../../app/controllers/post';

const router = express.Router();

router.route('/').post(store).get(index);

router.get('/:postId', show);

router.post('/:postId/comment', comment);

export default router;
