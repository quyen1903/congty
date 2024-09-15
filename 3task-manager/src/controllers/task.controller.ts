import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../core/success.response';
import {TaskService} from '../services/task.service'

class TaskController{
    async getAllTasks(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message: 'Get All Task Success',
            metadata: await TaskService.getAllTasks()
        }).send(res)
    }

    async createTask(req: Request, res: Response, next: NextFunction){
        const name = req.body
        new SuccessResponse({
            message: 'Get All Task Success',
            metadata: await TaskService.createTask(name)
        }).send(res)
    }

    async getTask(req: Request, res: Response, next: NextFunction){
        const taskID = req.params.id
        new SuccessResponse({
            message: 'Get All Task Success',
            metadata: await TaskService.getTask(taskID)
        }).send(res)
    }

    async updateTask(req: Request, res: Response, next: NextFunction){
        const taskID = req.params.id;
        const { name, completed } = req.body
        new SuccessResponse({
            message: 'Get All Task Success',
            metadata: await TaskService.updateTask(taskID, name, completed)
        }).send(res)
    }

    async deleteTask(req: Request, res: Response, next: NextFunction){
        const taskID = req.params.id
        new SuccessResponse({
            message: 'Get All Task Success',
            metadata: await TaskService.deleteTask(taskID)
        }).send(res)
    }
}

export default new TaskController()