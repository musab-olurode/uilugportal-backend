import express from 'express';
import { signin } from '../../../../app/controllers/auth';

const router = express.Router();

router.post('/signin', signin);

export default router;
