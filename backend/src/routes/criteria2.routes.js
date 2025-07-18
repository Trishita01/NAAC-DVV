import express from 'express';
const router = express.Router();
import { createResponse211, score211,createResponse212,score212 } from '../controllers/criteria2.controller.js';

router.route('/createResponse211')
    .post(createResponse211);

router.route('/score211')
    .get(score211);

router.route('/createResponse212')
    .post(createResponse212);

router.route('/score212')
    .get(score212);


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