import express from 'express';
const router = express.Router();

import {iqacRegister,userLogin,refreshAccessToken} from '../controllers/auth.controller.js';
//http://localhost:3000/api/v1/auth/iqacRegister

router.route('/iqacRegister')
    .post(iqacRegister);

router.route('/userLogin')
    .post(userLogin);

router.route('/refreshAccessToken')
    .post(refreshAccessToken);

export default router;
