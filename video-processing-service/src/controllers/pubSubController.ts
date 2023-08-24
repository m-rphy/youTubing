import { Request, Response, NextFunction } from "express";
import { createErr } from "../helperFunction";
import { setupLocalDirs } from "./gcsControllerUtils";

export const pubSubController = {
    getCloudData: (req: Request, res: Response, next: NextFunction) => {

        let data;
        try {
            const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
            data = JSON.parse(message);

            if(!data.name) {
                return next(createErr({
                    method: 'pubSubController.getCloudData',
                    status: 400,
                    message: 'Error not key name on found in file for Google-Cloud Storage',
                    err: 'error: data.name not found',
                }));
            };
            
            const inputFileName = data.name;
            const outputFileName = `processed-${inputFileName}`

            res.locals.inputFileName = inputFileName;
            res.locals.outputFileName = outputFileName

            setupLocalDirs();

            return next()

        } catch (err) {
            console.error(err);
            return next(createErr({
                method: 'pubSubController.getCloudData',
                status: 500,
                message: 'Error in buffer from Goolge-Cloud Storage',
                err,
            }))
        }
    }
};