import 'dotenv/config'
import express, { Express, Request, Response, NextFunction } from "express";
import {router} from './routes';
import { instanceMongodb } from './databases/init.mongo';

const app: Express =  express()

app.use(express.static('./public'));
app.use(express.json());

/* init mongodb */
instanceMongodb;

// init routes
app.use('/',router);

//error handling
interface CustomError extends Error {
    status?: number;
};

app.use((error: CustomError, req: Request ,res: Response, next: NextFunction)=>{
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status:'error',
        code:statusCode,
        stack:error.stack,
        message:error.message || 'Internal Server Error'
    })
});

export {app}