import express, {Response, Request, NextFunction} from "express";
import { processingController } from "./controllers/processingController";
import { pubSubController } from "./controllers/pubSubController";
import { googleCoudStorageController } from "./controllers/googelCloudStorageController";

const app = express();
app.use(express.json());

app.use('/', (_: Request, res: Response) => {
    res.status(200).json('Hello World');
})

// Handle video uploads
app.post('/process-video', 
    pubSubController.getCloudData,
    googleCoudStorageController.download,
    processingController.convert360p,
    googleCoudStorageController.upload,
    processingController.deleteFiles,
    (_: Request, res: Response) => {
        res.status(200).json("Successful video encoding");        
    }
);

// 404 Error handler
app.use('/*', (_: Request, res:Response) => {
    res.status(404).json('Page not found: 404')
});

// Global Error Handler
app.use((err: any, _: Request, res: Response, __: NextFunction) => {
    console.log('We have entered the twightlight Zone!');
    console.log('Our error message is: ', err);
    const errorStatus = err.status || 500;
    return res.status(errorStatus).send(err);
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Beep Boop: listening on port ${PORT}`);
});
