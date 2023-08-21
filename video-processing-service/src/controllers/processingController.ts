import ffmpeg from "fluent-ffmpeg";
import { Response, Request, NextFunction } from "express";

// helper function to create fileController error objects
// return value will be the object we pass into next, invoking global error handler
const createErr = (errInfo: any) => {
  const { method, status, err } = errInfo;
  return { 
    log: `fileController.${method} ${status}: ERROR: ${JSON.stringify(err)}`,
    message: { err: `Error occurred in fileController.${method}. Check server logs for more details.` },
    status,
  };
};

// Middleware responsible for processing video 
export const processingController = {

    // handler for processing videos in request body
    reqVidProcessing: async (req: Request, res: Response, next: NextFunction) => {

        const { inputFilePath, outputFilePath} = req.body;

        if (!inputFilePath || !outputFilePath) {
            return next( {
                method: 'reqVidProcessing',
                err: 'error: Invalid file path/s',
                type: 400
            });
        }

        try {
            await convertVideo(inputFilePath, outputFilePath);
            return next();

        } catch(err) {
            return next(createErr({
                method: `videoProcessingController.videoProcessing`, 
                message: 'an error occured while processing the video with FFMpeg',
                status: 500,
            }));
        };
    },
};

// helper function for converted video
export const convertVideo = (inputFilePath: string, outputFilePath: string) => {
    return new Promise<void>((resolve, reject)=> {
        ffmpeg(inputFilePath)
        .outputOption("-vf", "scale=-1:360") // convert to 360p
        .on('end', () => {
            console.log('Processing finished successfully');
            resolve();
        })
        .on('error', (err: any) => {
            console.log('error: Error while processing video');
            reject(err);
        })
        .save(outputFilePath);
    })
};