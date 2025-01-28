import download from './downloader.js';

// TODO: Add quality settings

export const downloadVideo = async (req, res) => {
    const params = ['-f', 'best'];
    
    await download(params, 'mp4', req, res);
}

export const downloadAudio = async (req, res) => {
    const params = ['-x', '--audio-format', 'mp3'];

    await download(params, 'mp3', req, res);
}

export const downloadThumbnail = async (req, res) => {
    const params = ['--write-thumbnail', '--skip-download'];
    
    await download(params, 'jpg', req, res);
}