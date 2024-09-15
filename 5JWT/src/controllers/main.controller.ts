import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../core/success.response';
import {MainService} from '../services/main.service'

class ProductController{
    async login(req: Request, res: Response, next: NextFunction){
        const { username, password } = req.body
        new SuccessResponse({
            message: 'Get All Product Static Success',
            metadata: await MainService.login(username, password)
        }).send(res)
    }

    async dashboard(req: Request, res: Response, next: NextFunction){
        console.log(req.user)
        const username = req.user.username
        new SuccessResponse({
            message: 'Get All Product Success',
            metadata: await MainService.dashboard(username)
        }).send(res)
    }

}

export default new ProductController()