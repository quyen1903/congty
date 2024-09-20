import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from "../core/success.response"
import ProjectService from "../services/project.service"

class ProjectsController{
    getAllData = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'success get all data',
            metadata:await ProjectService.getAllData()
        }).send(res)
    }
    addData = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'success update data',
            metadata:await ProjectService.addData(req.body)
        }).send(res)
    }
    updateData = async(req: Request, res: Response, next: NextFunction)=>{
        const projectId = req.params.id
        new SuccessResponse({
            message:'success update data',
            metadata:await ProjectService.updateData(projectId,req.body)
        }).send(res)
    }

    deleteData = async(req: Request, res: Response, next: NextFunction)=>{
        const projectId = req.params.id
        new SuccessResponse({
            message:'success update data',
            metadata:await ProjectService.deleteData(projectId)
        }).send(res)
    }

}

export default new ProjectsController()