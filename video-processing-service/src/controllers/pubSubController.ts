import { Request, Response, NextFunction } from "express";

const createErr = (errInfo: any) => {
    const { method, status, err } = errInfo;
    return { 
      log: `fileController.${method} ${status}: ERROR: ${JSON.stringify(err)}`,
      message: { err: `Error occurred in fileController.${method}. Check server logs for more details.` },
      status,
    };
  };

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
                    err: new Error('No "name" key on data object'),
                }));
            }
            const inputFileName = data.name;
            const outputFileName = `processed-${inputFileName}`

            // download the raw video from Cloud Storage
            res.locals.inputFileName = inputFileName;
            res.locals.outputFileName = outputFileName

            return next()

        } catch (err) {
            console.error(err);
            return next(createErr({
                method: 'pubSubController.getCloudData',
                status: 500,
                err,
            }))
        }
    }
};