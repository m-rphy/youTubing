import { NextFunction } from "express";
import { downloadRawVid, uploadProcVid } from "./gcsControllerHelperFuncs";


const gcsController = {
    download: async (req: Request, res: Response, next: NextFunction) => {

        const {inputFileName, outputFileName} = res.locals;
        await downloadRawVid();
        return next()
    },
    upload: async (req: Request, res: Response, next: NextFunction) => {

        const {inputFileName, outputFileName} = res.locals;
        await uploadProcVid();
        return next()
    },
    
}