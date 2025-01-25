import {exec} from "child_process";
import * as fs from "node:fs";

// TODO: Add quality settings

const cleanVideoId = (id) => {
    // Full regex: https://regex101.com/r/ciUbdv/1
    
    const regex = /([\w\-]{11})/;
    
    const match = id.match(regex);
    
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

const download = async (commandBase, extension, req, res) => {
    const id = req.params.id;
    const videoId = cleanVideoId(id);

    if (!videoId) {
        res.status(400).send('Invalid URL');
        return;
    }
    
    const filename = 'downloads/' + videoId + extension;
    
    // Set output name, input video, suppress download logs and output JSON
    const command = commandBase + ` -o "${filename}" "${videoId}" -q --no-simulate -j`
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error.message}`);
            res.status(500).send('An error occurred');
            return;
        }
        if (stderr) {
            console.error(`${stderr}`);
            res.status(500).send('An error occurred');
            return;
        }

        const info = JSON.parse(stdout);

        res.download(filename, info.title + extension, (err) => {
            if (err) {
                console.error(err);

                res.status(500).send('An error occurred');
            } else {
                // TODO: Add caching, maybe?
                fs.unlink(filename, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    });
}

export const downloadVideo = async (req, res) => {
    const command = 'yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]"';
    
    await download(command, '.mp4', req, res);
}

export const downloadAudio = async (req, res) => {
    const command = 'yt-dlp -x --audio-format mp3';

    await download(command, '.mp3', req, res);
}