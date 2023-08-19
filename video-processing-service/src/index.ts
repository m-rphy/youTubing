import express from "express";
import ffmpeg from "fluent-ffmpeg";


const app = express();

// app.get('/', (req, res) => {
//     res.send('Hello World');
// })

 app.post('/process-video', (req, res) => {
     
     const { inputFilePath, outputFilePath} = req.body;
     
     if (!inputFilePath || !outputFilePath) {
         res.status(400).send("Bad Request: Missing file path");
     }
 
     ffmpeg(inputFilePath)
         .outputOption("-vf", "scale=-1:360") // convert to 360p
         .on('end', () => {
             res.status(200).send('File Processing Finished Successfully');
         })
         .on('error', (err: any) => {
             console.log('An error occurred during encoding');
             res.status(500).send(`Internal Error: ${err.message}`);
         })
         .save(outputFilePath);
 });

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Beep Boop: listening on port ${PORT}`);
})
