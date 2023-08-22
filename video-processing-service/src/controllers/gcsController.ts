import { Request, Response, NextFunction } from "express";
import { deletePrcVideo, deleteRawVideo, downloadRawVid, uploadProcVid } from "./gcsControllerHelperFuncs";

export const gcsController = {
    download: async (_: Request, res: Response, next: NextFunction) => {
        
        const {outputFileName, inputFileName } = res.locals;
        
        try {
           await downloadRawVid(inputFileName);
           return next()
        } catch (err) {
           await Promise.all([
               deletePrcVideo(outputFileName),
               deleteRawVideo(inputFileName)
           ]);
           return next(new Error('Error in gcsController.download'));
        }
    },

    upload: async (_: Request, res: Response, next: NextFunction) => {

        const {outputFileName, inputFileName } = res.locals;
        
        try {
           const { outputFileName} = res.locals;
           await uploadProcVid(outputFileName);
           return next()
        } catch (err) {
           await Promise.all([
               deletePrcVideo(outputFileName),
               deleteRawVideo(inputFileName)
           ]);
           return next(new Error('Error in gcsController.upload'));
        }
    },
    
}
