import ffmpeg from "fluent-ffmpeg";
import { Response, Request, NextFunction } from "express";

// helper function to create fileController error objects
// return value will be the object we pass into next, invoking global error handler
const createErr = (errInfo: any) => {
  const { method, type, err } = errInfo;
  return { 
    log: `fileController.${method} ${type}: ERROR: ${typeof err === 'object' ? JSON.stringify(err) : err}`,
    message: { err: `Error occurred in fileController.${method}. Check server logs for more details.` }
  };
};

// Middleware responsible for processing video 

export const videoProcessing = {

    processVideo: (req: Request, res: Response, next: NextFunction) => {

        const { inputFilePath, outputFilePath} = req.body;

        if (!inputFilePath || !outputFilePath) {
            res.status(400).send("Bad Request: Missing file path");
        }

        ffmpeg(inputFilePath)
        .outputOption("-vf", "scale=-1:360") // convert to 360p
        .on('end', () => {
            return next();
        })
        .on('error', (err: any) => {
            console.log('An error occurred during encoding');
            res.status(500).send(`Internal Error: ${err.message}`);
            return next(createErr({
                log: `videoProcessingController.videoProcessing: error: ${JSON.stringify(err)}`, 
                message: {err: 'an error occured while processing the video with FFMpeg' },
                err 
            }));
        })
        .save(outputFilePath);

        return next();
    }
};

