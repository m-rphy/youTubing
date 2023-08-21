import express, {Response, Request, NextFunction} from "express";
import { processingController } from "./controllers/processingController";

const app = express();
app.use(express.json());


// Handle video uploads
app.post('/process-video', 
    processingController.reqVidProcessing,
    (req: Request, res: Response) => {
        res.status(200).json("Successful video encoding");        
    }
);

// 404 Error handler
app.use('/*', (req: Request, res:Response) => {
    res.status(404).json('Page not found: 404')
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log('We have entered the twightlight Zone!');
    res.locals.message = err.message;
    console.log('Our error message is: ', err.message);
    const errorStatus = err.status || 500;
    return res.status(errorStatus).send(res.locals.message);
})

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Beep Boop: listening on port ${PORT}`);
})
