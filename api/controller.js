import {spawn} from 'child_process';

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

const download = async (params, extension, req, res) => {
    const id = req.params.id;
    const videoId = cleanVideoId(id);

    if (!videoId) {
        res.status(400).send('Invalid URL');
        return;
    }
    
    const ytDlp = spawn('yt-dlp', [...params, '-o', '-', videoId]);
    
    // Set the response headers (e.g., for a video file)
    res.setHeader('Content-Disposition', `attachment; filename="${videoId}.${extension}"`); // Optional: Suggest file name for download

    // Pipe yt-dlp's stdout to the response
    ytDlp.stdout.pipe(res);

    // Handle any errors in the yt-dlp process
    ytDlp.on('error', (err) => {
        console.error('Error with yt-dlp:', err);
        res.status(500).send('Error downloading video');
    });

    // Handle when the download is complete
    ytDlp.on('close', (code) => {
        if (code !== 0) {
            console.error(`yt-dlp exited with code ${code}`);
            res.status(500).send('Failed to download video');
        }
    });
}

export const downloadVideo = async (req, res) => {
    const params = ['-f', 'best'];
    
    res.setHeader('Content-Type', 'video/mp4');
    await download(params, 'mp4', req, res);
}

export const downloadAudio = async (req, res) => {
    const params = ['-x', '--audio-format', 'mp3'];

    res.setHeader('Content-Type', 'audio/mp3');
    await download(params, 'mp3', req, res);
}