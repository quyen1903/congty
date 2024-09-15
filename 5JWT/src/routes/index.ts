import express from 'express';

import main from './main'

const router = express.Router();

router.use('/api/v1', main);


export {router};