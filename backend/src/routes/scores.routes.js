import express from 'express';
const router = express.Router();
import { grade211 } from '../controllers/score.controller.js';

// Create a new score
router.route('/grade211')
    .post(grade211);

export default router;