import Ffmpeg from "fluent-ffmpeg";
import path from "path";
import { Response, Request, NextFunction } from "express";
import { deleteProcessedVideo, deleteRawVideo } from "./gcsControllerUtils";
import { createErr } from "../helperFunction";

// Middleware responsible for processing video 
export const processingController = {

    convert360p: async (_: Request, res: Response, next: NextFunction) => {

        const { inputFileName, outputFileName } = res.locals;

        try {
            // TODO - make sure that these file paths are correct
            await convertVideo(inputFileName, outputFileName);
            return next();

        } catch(err) {
            
            await Promise.all([
                deleteProcessedVideo(outputFileName),
                deleteRawVideo(inputFileName)
            ]);

            return next(createErr({
                method: `processingController.videoProcessing`, 
                message: 'an error occured while processing the video with FFMpeg',
                status: 500,
                err,
            }));
        };
    },

    deleteFiles: async (_: Request, res: Response, next: NextFunction) => {

        const { inputFileName, outputFileName } = res.locals;
        
        try {
            await Promise.all([
                deleteProcessedVideo(outputFileName),
                deleteRawVideo(inputFileName)
            ]);
        } catch (err) {
            return next(createErr({
                method: `processingController.deleteFiles`, 
                message: 'an error occured while deleting local Video files',
                status: 500,
                err,
                })
            );
        };
    }
};

// helper function for converted video
export const convertVideo = (inputFilePath: string, outputFilePath: string) => {
    
    return new Promise<void>((resolve, reject)=> {
        Ffmpeg(path.resolve(__dirname, inputFilePath))
        .outputOption('-vf', 'scale=-1:360,  pad=ceil(iw/2)*2:ceil(ih/2)*2') // convert to 360p
        .on('end', () => {
            console.log('Processing finished successfully');
            resolve();
        })
        .on('error', (err: any) => {
            console.log('error: Error while processing video');
            reject(err);
        })
        .save(path.resolve(__dirname, outputFilePath));
    });
};
