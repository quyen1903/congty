import express from 'express';

import tasks from './task'

const router = express.Router();

router.use('/api/v1/tasks', tasks);

export {router};