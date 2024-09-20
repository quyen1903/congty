import { Request, Response, NextFunction } from 'express'; 
import AccessService from '../services/access.service';
import { SuccessResponse } from '../core/success.response';
import { RegisterDTO, LoginDTO, UpdateDTO } from '../dto/user.dto';

class AccessController{
    //in register and login, we pass data from request body tp data transfer object (DTO)
    //we pass instance of DTO to login and register method
    handlerRefreshToken = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'get token success',
            metadata:await AccessService.handleRefreshToken(
                req.keyStore,
                req.user,
                req.refreshToken,
            )
        }).send(res)
    }
    logout = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'logout success',
            metadata:await AccessService.logout( req.keyStore )
        }).send(res)
    }
    update = async(req: Request, res: Response, next: NextFunction) => {
        const userId = req.user.userId;
        
        const { login, payload } = req.body;
        const { email, password } = login; 
        const { newEmail, newName, newPassword } = payload; 
    
        // Khởi tạo DTO cho login và payload
        const loginDTO = new LoginDTO(email, password);
        const updatePayload = { newEmail, newName, newPassword };
    
        new SuccessResponse({
            message: 'update success',
            metadata: await AccessService.update(userId, loginDTO, updatePayload)
        }).send(res);
    }
    
    login = async(req: Request, res: Response, next: NextFunction)=>{
        const {email, password} = req.body;
        const login = new LoginDTO(email, password);

        new SuccessResponse({
            message: 'login success',
            metadata:await AccessService.login(login)
        }).send(res)
    }
    register = async (req: Request, res: Response, next: NextFunction) => {
        const {name, email, password} = req.body;
        const register = new RegisterDTO(name, email, password);

        new SuccessResponse({
            message: 'register success',
            metadata: await AccessService.register(register)
        }).send(res);
    }

}
export default new AccessController()