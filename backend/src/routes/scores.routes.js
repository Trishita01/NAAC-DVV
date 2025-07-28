import express from 'express';
const router = express.Router();
import { score21, score22, score23, score24, score26, score2} from '../controllers/score.controller.js';

// Create a new score
router.route('/grade21')
    .post(score21);

router.route('/grade22')
    .post(score22);

router.route('/grade23')
    .post(score23);

router.route('/grade24')
    .post(score24);

router.route('/grade26')
    .post(score26);

router.route('/grade2')
    .post(score2);

export default router;