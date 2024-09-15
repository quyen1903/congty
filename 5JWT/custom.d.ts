import { Request } from "express";
/*
    Extends Request interface
*/
declare module 'express-serve-static-core' {
    interface Request {
        user: any;
    }
}