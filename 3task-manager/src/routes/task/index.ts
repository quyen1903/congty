import express from 'express';
import taskController from '../../controllers/task.controller';
import asyncHandler from '../../helper/async.handler';

const router = express.Router();

router.route('/')
.get(asyncHandler(taskController.getAllTasks))
.post(asyncHandler(taskController.createTask))

router.route('/:id')
.get(asyncHandler(taskController.getTask))
.patch(asyncHandler(taskController.updateTask))
.delete(asyncHandler(taskController.deleteTask))


export default router