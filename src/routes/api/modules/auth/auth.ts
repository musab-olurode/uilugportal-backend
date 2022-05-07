import express from 'express';
import { getLoggedInUser, signout } from '../../../../app/controllers/auth';

const router = express.Router();

router.get('/me', getLoggedInUser);
router.post('/signout', signout);

export default router;
