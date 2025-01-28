import {execSync, spawn} from "child_process";
import * as fs from "node:fs";

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

const download = async (params, extension, req, res) => {
    const id = req.params.id;
    const videoId = cleanVideoId(id);

    if (!videoId) {
        res.status(400).send('Invalid URL');
        return;
    }
    
    // Load cached file if it exists
    if (fs.existsSync(`./downloads/${videoId}.${extension}`)) {
        // TODO: Find some way to store title
        res.download(`./downloads/${videoId}.${extension}`, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            }
        });
        return;
    }

    const command = ['yt-dlp', ...params, '-o', `./downloads/${videoId}.${extension}`, '-q', '--no-simulate', '-j', videoId].join(' ');
    
    const ytDlp = execSync(command);
    
    const info = JSON.parse(ytDlp.toString());
    const title = info.title.trim();
    
    res.download(`./downloads/${videoId}.${extension}`, `${title}.${extension}`, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file');
        }
    });
}

export default download;