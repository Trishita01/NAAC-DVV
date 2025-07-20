import express from 'express';
const router = express.Router();
import { createResponse211, score211,createResponse212,score212, createResponse233, createResponse222, createResponse242, createResponse243, score222, score242, score243 } from '../controllers/criteria2.controller.js';

router.route('/createResponse211')
    .post(createResponse211);

router.route('/score211')
    .get(score211);

router.route('/createResponse212')
    .post(createResponse212);

router.route('/score212')
    .get(score212);

router.route('/createResponse233')
    .post(createResponse233);

router.route('/createResponse222')
    .post(createResponse222);

router.route('/createResponse242')
    .post(createResponse242);

router.route('/createResponse243')
    .post(createResponse243);

router.route('/score222')
    .get(score222);

router.route('/score242')
    .get(score242);

router.route('/score243')
    .get(score243);

// router.route('/createResponse241243222233')
//     .post(createResponse241243222233);


// router.route('/createResponse242')
//     .post(createResponse242);


// router.route('/createResponse263')
//     .post(createResponse263);

// router.route('/createResponse271')
//     .post(createResponse271);

// router.route('/getResponsesByCriteriaCode/:criteriaCode')
//     .get(getResponsesByCriteriaCode);

export default router;