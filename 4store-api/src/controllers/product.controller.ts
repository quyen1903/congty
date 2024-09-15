import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../core/success.response';
import {ProductService} from '../services/product.service'

class ProductController{
    async getAllProductsStatic(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message: 'Get All Product Static Success',
            metadata: await ProductService.getAllProductsStatic()
        }).send(res)
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction){
        const query = req.query
        new SuccessResponse({
            message: 'Get All Product Success',
            metadata: await ProductService.getAllProducts(query)
        }).send(res)
    }

}

export default new ProductController()