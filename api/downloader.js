import {execSync} from "child_process";
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
    
    const directory = `./downloads/${videoId}`;
    const filePath = `${directory}/file.${extension}`;
    const infoPath = `${directory}/info.json`;
    
    // Load cached file if it exists
    if (fs.existsSync(filePath) && fs.existsSync(infoPath)) {
        const info = JSON.parse(fs.readFileSync(infoPath).toString());
        
        res.download(filePath, `${info.title}.${extension}`, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            }
        });
        return;
    }

    const command = ['yt-dlp', ...params, '-o', filePath, '-q', '--no-simulate', '-j', videoId].join(' ');
    
    const ytDlp = execSync(command);
    
    const infoString = ytDlp.toString();
    const info = JSON.parse(infoString);
    const title = info.title.trim();
    
    fs.writeFileSync(infoPath, infoString);
    
    res.download(filePath, `${title}.${extension}`, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file');
        }
    });
}

export default download;