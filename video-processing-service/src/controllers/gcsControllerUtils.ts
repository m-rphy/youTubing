import { Storage } from "@google-cloud/storage";
import { convertVideo } from "./processingController";
import path from "path";
import fs from 'fs';

/**
 * This file has helper functions that 
 * enable controllers to interact with 
 * Google-Cloud Storage and local files
 */

// New Instance of Google-Cloud Storage (GCS)
const storage = new Storage();

// NOTE Must have a globally unique name on GCS
const rawVidBucket = 'youTubing-raw-videos';
const processedVidBucket = 'youTubing-proc-videos';

const localRawVideoPath = path.resolve(__dirname,'./raw-videos');
const localProcessedVideoPath = path.resolve(__dirname,'./proc-videos');

export const setupLocalDirs = () => {
    ensureDirExist(localRawVideoPath);
    ensureDirExist(localProcessedVideoPath);
};

const ensureDirExist = (dirPath: string): void => {
    if (!fs.existsSync(dirPath)) {
        // recursive enables making nested directories
        fs.mkdirSync(dirPath, {recursive: true}); 
        console.log(`Directory created a ${dirPath}`);
    }
};

export const convertAndSaveVidLocally =  (rawVideoName: string, processedVideoName: string) => {
    try{
        convertVideo(`${localRawVideoPath}/${rawVideoName}`,`${localProcessedVideoPath}/${processedVideoName}`);
    } catch (err) {
        console.log(JSON.stringify(err));
        return err;
    };
};

export const downloadRawVid = async (rawVideoName: string) => {
    try{
        await storage.bucket(rawVidBucket)
            .file(rawVideoName)
            .download({destination: `${localRawVideoPath}/${rawVideoName}`});

        console.log(`
            gs://${rawVidBucket}/${rawVideoName} successfully downloaded to ${localRawVideoPath}/${rawVideoName};
        `);
    } catch (err) {
        console.error('error: Error downloading from google-cloud storage');
    };
};

export const uploadProcVid = async (processedVideoName: string) => {
    const bucket = storage.bucket(processedVidBucket);
    try{
        await bucket.upload(`${localProcessedVideoPath}/${processedVideoName}`, {
            destination: processedVideoName
        });

        await bucket.file(processedVideoName).makePublic();

        console.log(`
            ${localProcessedVideoPath}/${processedVideoName} was successfully uploaded to gs://${processedVidBucket}/${processedVideoName};
        `);
    } catch (err) {
        console.error('error: Error uploading to google-cloud storage');
    };
};

/**
 * 
 * @param filename - name of raw video file to be deleted
 * @returns a function call to deleteFile() wiht local raw video path
 */
export const deleteRawVideo = (rawVideoName: string) => {
    return deleteFile(`${localRawVideoPath}/${rawVideoName}`);
};

export const deleteProcessedVideo = (processedVideoName: string) => {
    return deleteFile(`${localProcessedVideoPath}/${processedVideoName}`);
};

const deleteFile = (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            console.log(`File not found at ${filePath}`)
            reject()
        } else {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                } else {
                    resolve();
                }
            })
        }
    })
};