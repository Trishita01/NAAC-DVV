import express from 'express';
const router = express.Router();
import { getAllCriteria1, createResponse113,createResponse121 createResponse122, createResponse123,createResponse132, createResponse133 getResponsesByCriteriaCode } from '../controllers/criteria1.controller.js';

router.route('/getAllCriteria1').get(getAllCriteria1);

router.route('/createResponse113')
    .post(createResponse113);

router.route('/createResponse121')
    .post(createResponse121);

router.route('/createResponse122')
    .post(createResponse122);

router.route('/createResponse123')
    .post(createResponse123);

router.route('/createResponse132')
    .post(createResponse132);

router.route('/createResponse133')
    .post(createResponse133);

router.route('/getResponsesByCriteriaCode/:criteriaCode')
    .get(getResponsesByCriteriaCode);

export default router;