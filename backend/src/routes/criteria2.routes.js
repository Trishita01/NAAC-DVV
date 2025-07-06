import express from 'express';
const router = express.Router();
import { getAllCriteria211, createResponse211, createResponse212, createResponse241243222233, createResponse242, createResponse263, createResponse271 } from '../controllers/criteria2.controller.js';

router.route('/getAllCriteria2').get(getAllCriteria211);

router.route('/createResponse211')
    .post(createResponse211);

router.route('/createResponse212')
    .post(createResponse212);


router.route('/createResponse241243222233')
    .post(createResponse241243222233);


router.route('/createResponse242')
    .post(createResponse242);


router.route('/createResponse263')
    .post(createResponse263);

router.route('/createResponse271')
    .post(createResponse271);

router.route('/getResponsesByCriteriaCode/:criteriaCode')
    .get(getResponsesByCriteriaCode);

export default router;