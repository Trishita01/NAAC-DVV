import express from 'express';
const router = express.Router();
import { getAllCriteria1 } from '../controllers/criteria1.controller.js';

router.route('/getAllCriteria1').get(getAllCriteria1);

export default router;