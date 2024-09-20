import express from 'express';
import userController from'../../controller/user.controller';
import { authentication } from '../../auth/authUtils';
import asyncHandler from '../../helper/async.handler';

const router = express.Router();

router.post('/user/register',asyncHandler(userController.register))
router.post('/user/login',asyncHandler(userController.login))   

router.use(authentication)

router.post('/user/update',asyncHandler(userController.update))
router.post('/user/logout',asyncHandler(userController.logout))
router.post('/user/handlerRefreshToken',asyncHandler(userController.handlerRefreshToken))

export default router