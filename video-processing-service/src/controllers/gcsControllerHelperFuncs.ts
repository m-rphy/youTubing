import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import { convertVideo } from "./processingController";

// Interacting with google cloud storage
// and local file interactions

// instance of GCS
const storage = new Storage();

// have to be globally unique name GCS
const rawVidBucket = 'youTubing-raw-videos';
const procVidBucket = 'youTubing-proc-videos';

// local paths
const localRawVidPath = './raw-videos';
const localProcVidPath = './proc-videos';

/*
* Creates the local directories for raw and processed videos
*/
export const setupDirs = () => {
    ensureDirExist(localRawVidPath);
    ensureDirExist(localProcVidPath);
};

export const convertAndSaveVidLocally =  (rawVidName: string, procVidName: string) => {
    try{
        convertVideo(`${localRawVidPath}/${rawVidName}`,`${localProcVidPath}/${procVidName}`);
    } catch (err) {
        console.log(JSON.stringify(err));
        return err;
    };
};

/**
 * @param filename - The name of the file to download form the 
 * {@link rawVidBucket} bucket in the {@link localRawVidPath} folder.
 * @returns A promise that resolves when the file has been downloaded
 */
export const downloadRawVid = async (fileName: string) => {
    try{
        await storage.bucket(rawVidBucket)
            .file(fileName)
            .download({destination: `${localRawVidPath}/${fileName}`});

        console.log(`
            gs://${rawVidBucket}/${fileName} successfully downloaded to ${localRawVidPath}/${fileName};
        `);
    } catch (err) {
        console.error('error: Error downloading from google-cloud storage');
    };
};

/**
 * @param filename - The name of the file to download form the 
 * {@link procVidBucket} bucket in the {@link localProcVidPath} folder.
 * @returns A promise that resolves when the file has been uploaded.
 */
export const uploadProcVid = async (fileName: string) => {
    const bucket = storage.bucket(procVidBucket);
    try{
        await bucket.upload(`${localProcVidPath}/${fileName}`, {
            destination: fileName
        });

        await bucket.file(fileName).makePublic();

        console.log(`
            ${localProcVidPath}/${fileName} was successfully uploaded to gs://${procVidBucket}/${fileName};
        `);
    } catch (err) {
        console.error('error: Error uploading to google-cloud storage');
    };
};

/**
 * 
 * @param filePath - The path to the local file to delete
 * @returns A return that resolves when the file has been deleted
 */
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

/**
 * 
 * @param filename - name of raw video file to be deleted
 * @returns a function call to deleteFile() wiht local raw video path
 */
export const deleteRawVideo = (filename: string) => {
    return deleteFile(`${localRawVidPath}/${filename}`)
}

/**
 * 
 * @param filename name of processed video file to be deleted
 * @returns a function call to deleteFile() wiht local processed video path
 */
export const deletePrcVideo = (filename: string) => {
    return deleteFile(`${localProcVidPath}/${filename}`)
}

/**
 * 
 * @param dirPath - The directory path to check
 */
const ensureDirExist = (dirPath: string): void => {
    if (!fs.existsSync(dirPath)) {
        // recursive enables making nested directories
        fs.mkdirSync(dirPath, {recursive: true}); 
        console.log(`Directory created a ${dirPath}`);
    }
}