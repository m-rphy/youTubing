import { Request, Response, NextFunction } from "express";
import { downloadRawVid, uploadProcVid } from "./gcsControllerHelperFuncs";

const gcsController = {
    download: async (req: Request, res: Response, next: NextFunction) => {

        const {inputFileName } = res.locals;
        await downloadRawVid(inputFileName);
        return next()
    },
    upload: async (req: Request, res: Response, next: NextFunction) => {

        const { outputFileName} = res.locals;
        await uploadProcVid(outputFileName);
        return next()
    },
    
}