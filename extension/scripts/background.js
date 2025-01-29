// TODO: Download in the background, so you can close the popup or go to a different tab while its working

let downloadingAudio = false;

function downloadAudio(videoId) {
    downloadingAudio = true; 
    
    chrome.downloads.download({
        url: `http://localhost:3000/api/v1/audio/${videoId}`,
        saveAs: false
    }, (downloadId) => {
        chrome.runtime.sendMessage({
            type: 'status',
            format: 'audio',
            downloading: false
        })
        
        downloadingAudio = false;
        
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
    });
}

let downloadingVideo = false;

function downloadVideo(videoId) {
    downloadingVideo = true;

    chrome.downloads.download({
        url: `http://localhost:3000/api/v1/video/${videoId}`,
        saveAs: false
    }, (downloadId) => {
        chrome.runtime.sendMessage({
            type: 'status',
            format: 'video',
            downloading: false
        })

        downloadingVideo = false;

        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
    });
}

let downloadingThumbnail = false;

function downloadThumbnail(videoId) {
    downloadingThumbnail = true;

    chrome.downloads.download({
        url: `http://localhost:3000/api/v1/thumbnail/${videoId}`,
        saveAs: false
    }, (downloadId) => {
        chrome.runtime.sendMessage({
            type: 'status',
            format: 'thumbnail',
            downloading: false
        })

        downloadingThumbnail = false;

        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'download') {
        if (message.format === 'audio') {
            downloadAudio(message.videoId);
        }
        
        if (message.format === 'video') {
            downloadVideo(message.videoId);
        }
        
        if (message.format === 'thumbnail') {
            downloadThumbnail(message.videoId);
        }
    }
    
    if (message.type === 'status') {
        if (message.format === 'audio') {
            sendResponse({downloading: downloadingAudio});
        }

        if (message.format === 'video') {
            sendResponse({downloading: downloadingVideo});
        }
        
        if (message.format === 'thumbnail') {
            sendResponse({downloading: downloadingThumbnail});
        }
    }
});