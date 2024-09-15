import express from 'express';
import productController from '../../controllers/product.controller';
import asyncHandler from '../../helper/async.handler';

const router = express.Router();

router.route('/').get(asyncHandler(productController.getAllProducts))

router.route('/static').get(asyncHandler(productController.getAllProductsStatic))


export default router