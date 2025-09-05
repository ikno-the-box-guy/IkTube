import download from './downloader.js';
import {cleanVideoId} from "./utils.js";
import {execSync} from "child_process";

// TODO: Add quality settings

export const downloadVideo = async (req, res) => {
    const params = ['-f', '"bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"'];
    
    await download(params, 'mp4', req, res);
}

export const downloadAudio = async (req, res) => {
    const params = ['-x', '--audio-format', 'mp3'];

    await download(params, 'mp3', req, res);
}

export const downloadThumbnail = async (req, res) => {
    const params = ['--write-thumbnail', '--skip-download', '--convert-thumbnails', 'png'];
    
    await download(params, 'png', req, res);
}

export const fetchInfo = async (req, res) => {
    const id = req.params.id;
    const videoId = cleanVideoId(id);

    if (!videoId) {
        res.status(400).send('Invalid URL');
        return;
    }

    const command = ['yt-dlp', '-q', '--skip-download', '-j', videoId].join(' ');

    const ytDlp = execSync(command);
    
    const info = ytDlp.toString();
    
    if (!info) {
        res.status(404).send('Video not found');
        return;
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.send(info);
}