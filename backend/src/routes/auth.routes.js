import express from 'express';
const router = express.Router();

import {iqacRegister} from '../controllers/auth.controller.js';
//http://localhost:3000/api/v1/auth/iqacRegister

router.route('/iqacRegister')
    .post(iqacRegister);

export default router;
