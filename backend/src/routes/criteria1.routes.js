import express from 'express';
const router = express.Router();
import { getAllCriteria1, createResponse113, getResponsesByCriteriaCode } from '../controllers/criteria1.controller.js';

router.route('/getAllCriteria1').get(getAllCriteria1);

router.route('/createResponse113')
    .post(createResponse113);

router.route('/getResponsesByCriteriaCode/:criteriaCode')
    .get(getResponsesByCriteriaCode);

export default router;