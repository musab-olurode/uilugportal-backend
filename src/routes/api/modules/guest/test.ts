import express from 'express';
import { testFunction } from '../../../../app/controllers/test';

const router = express.Router();

router.post('/', testFunction);

export default router;
