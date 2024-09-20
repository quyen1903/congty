import express from'express';
import projectsController from'../../controller/project.controller';
import asyncHandler from '../../helper/async.handler';
const router = express.Router();

router.get('/',asyncHandler(projectsController.getAllData));
router.post('/',asyncHandler(projectsController.addData));
router.put('/:id',asyncHandler(projectsController.updateData));
router.delete('/:id',asyncHandler(projectsController.deleteData));

export default router