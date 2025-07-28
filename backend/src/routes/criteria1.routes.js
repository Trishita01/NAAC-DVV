import express from 'express';
const router = express.Router();
import { createResponse113,createResponse121, createResponse122_123,createResponse132, createResponse133, getResponsesByCriteriaCode,score113 } from '../controllers/criteria1.controller.js';


router.route('/createResponse113')
    .post(createResponse113);

router.route('/createResponse121')
    .post(createResponse121);

router.route('/createResponse122_123')
    .post(createResponse122_123);

router.route('/createResponse123')
    .post(createResponse122_123);

router.route('/createResponse132')
    .post(createResponse132);

router.route('/createResponse133')
    .post(createResponse133);

router.route('/getResponsesByCriteriaCode/:criteriaCode')
    .get(getResponsesByCriteriaCode);

router.route('/score113')
    .get(score113);

// router.route('/score121')
//     .get(score121);
    
// router.route('/score122')
//     .get(score122); 
export default router;

