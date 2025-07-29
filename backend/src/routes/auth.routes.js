import express from 'express';
const router = express.Router();

import {iqacRegister, userLogin, refreshAccessToken, getAuthStatus} from '../controllers/auth.controller.js';
//http://localhost:3000/api/v1/auth/iqacRegister

router.route('/iqacRegister')
    .post(iqacRegister);

router.route('/userLogin')
    .post(userLogin);

router.route('/refresh')
    .post(refreshAccessToken);

router.route('/me')
    .get(getAuthStatus);

export default router;
