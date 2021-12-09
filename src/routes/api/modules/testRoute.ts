import express from 'express';
import { testFunction } from '../../../app/controllers/testController';

const router = express.Router();

router.post('/test', testFunction);

export default router;
