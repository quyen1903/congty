import express from 'express';
import mainController from '../../controllers/main.controller';
import asyncHandler from '../../helper/async.handler';
import {authenticationMiddleware} from '../../middleware/auth'

const router = express.Router();


router.route('/dashboard').get(authenticationMiddleware, asyncHandler(mainController.dashboard))
router.route('/login').post(asyncHandler(mainController.login))


export default router