import { Request, Response, NextFunction } from "express";
import { deleteProcessedVideo, deleteRawVideo, downloadRawVid, uploadProcVid } from "./gcsControllerUtils";
import { createErr } from "../helperFunction";

export const googleCoudStorageController = {
    download: async (_: Request, res: Response, next: NextFunction) => {
        
        const {outputFileName, inputFileName } = res.locals;
        
        try {
           await downloadRawVid(inputFileName);
           return next()
        } catch (err) {
            await Promise.all([
                deleteProcessedVideo(outputFileName),
                deleteRawVideo(inputFileName)
            ]);
            return next(createErr({
                method: 'gcsController.download',
                message: 'error: Could not download files from Google-Cloud Storage',
                status: 500,
                err,
                })
            );
        };
    },

    upload: async (_: Request, res: Response, next: NextFunction) => {

        const {outputFileName, inputFileName } = res.locals;
        
        try {
           const { outputFileName} = res.locals;
           await uploadProcVid(outputFileName);
           return next()
        } catch (err) {
            await Promise.all([
                deleteProcessedVideo(outputFileName),
                deleteRawVideo(inputFileName)
            ]);
            return next(createErr({
                method: 'gcsController.upload',
                message: 'error: Could not upload files to Google-Cloud Storage',
                status: 500,
                err,
                })
            );
        };
    },  
};
