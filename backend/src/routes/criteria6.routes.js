import express from 'express';
const router = express.Router();
import { getAllCriteria6, createResponse623,createResponse632, createResponse633, createResponse634,createResponse642, createResponse653, getResponsesByCriteriaCode } from '../controllers/criteria6.controller.js';

router.route('/getAllCriteria6').get(getAllCriteria6);

router.route('/createResponse623')
    .post(createResponse623);

router.route('/createResponse632')
    .post(createResponse632);

router.route('/createResponse633')
    .post(createResponse633);

router.route('/createResponse634')
    .post(createResponse634);

router.route('/createResponse642')
    .post(createResponse642);

router.route('/createResponse653')
    .post(createResponse653);

router.route('/getResponsesByCriteriaCode/:criteriaCode')
    .get(getResponsesByCriteriaCode);

export default router;

