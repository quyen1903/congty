import { BadRequestError, NotFoundError } from '../core/error.response'
import Task from '../models/task.model'

export class TaskService{
    static async getAllTasks(){
        const tasks = await Task.find({})
        if (!tasks || tasks.length === 0) {
            throw new NotFoundError('No tasks found');
        }        
        return tasks;
    }

    static async createTask(name: string){
        const task = await Task.create(name)
        return task
    }

    static async getTask(taskId: string){
        if(!taskId) throw new BadRequestError('Can not find taskId ')
        const task = await Task.findOne({ _id: taskId })
        if (!task)  throw new NotFoundError('Task not found')
        return task
    }

    static async updateTask(taskId: string, name: string, completed: boolean){
        if(!taskId) throw new BadRequestError('Can not find taskId ')
        const task = await Task.findOneAndUpdate({ _id: taskId }, {name: name, completed: completed})
        if (!task)  throw new NotFoundError('Task not found')
        return task
    }

    static async deleteTask(taskId: string){
        if(!taskId) throw new BadRequestError('Can not find taskId ')
        const task = await Task.findOneAndDelete({ _id: taskId })
        if (!task)  throw new NotFoundError('Task not found')
        return task
    }
}