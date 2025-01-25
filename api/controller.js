import {exec} from "child_process";
import * as fs from "node:fs";

// TODO: Add quality settings

const cleanUrl = (url) => {
    // https://regex101.com/r/ciUbdv/1
    
    const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu\.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]{11})((?:\?|\&)\S+)?$/;
    
    const match = url.match(regex);
    
    if (match) {
        return match[6];
    } else {
        return null;
    }
}

export const downloadVideo = async (req, res) => {
    const { url } = req.body;
    const videoId = cleanUrl(url);
    
    if (!videoId) {
        res.status(400).send('Invalid URL');
        return;
    }
    
    const fileName = 'downloads/' + videoId + '.mp4';
    
    exec(`yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]" -o "${fileName}" "${videoId}"`, (error, stdout, stderr) => {
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
        
        res.download(fileName, (err) => {
            if (err) {
                console.log(err);
            } else {
                // TODO: Add caching
                fs.unlink(fileName, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    });
}

export const downloadAudio = async (req, res) => {
    const { url } = req.body;
    const videoId = cleanUrl(url);

    if (!videoId) {
        res.status(400).send('Invalid URL');
        return;
    }

    const fileName = 'downloads/' + videoId + '.mp3';

    exec(`yt-dlp -x --audio-format mp3 -o "${fileName}" "${videoId}"`, (error, stdout, stderr) => {
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

        res.download(fileName, (err) => {
            if (err) {
                console.log(err);
            } else {
                // TODO: Add caching
                fs.unlink(fileName, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    });
}