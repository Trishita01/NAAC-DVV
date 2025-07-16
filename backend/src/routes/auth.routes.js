import express from 'express';
const router = express.Router();

import {iqacRegister} from '../controllers/auth.controller.js';

router.route('/iqacRegister')
    .post(iqacRegister);

export default router;
