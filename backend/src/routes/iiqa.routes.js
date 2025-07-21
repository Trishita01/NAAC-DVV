import express from 'express';
const router = express.Router();
import { createIIQAForm } from '../controllers/iiqa.controller.js';


router.route('/createIIQAForm')
    .post(createIIQAForm);

export default router;
