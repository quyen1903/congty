import express from 'express';
// import user from './user';
import project from './project';

const router = express.Router();

router.use('/projects',project)
// router.use('/', user);


export {router};