import express from 'express';
import { destroy, store, update } from '../../../../app/controllers/schedule';

const router = express.Router();

router.post('/', store);
router.route('/:scheduleId').put(update).delete(destroy);

export default router;
