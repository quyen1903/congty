import express from 'express';

import tasks from './product'

const router = express.Router();

router.use('/api/v1/products', tasks);


export {router};