let videoId = undefined;

// Get the download video button
const downloadVideoButton = document.getElementById("download-video");
downloadVideoButton.addEventListener("click", downloadVideo);

// Get the download audio button
const downloadAudioButton = document.getElementById("download-audio");
downloadAudioButton.addEventListener("click", downloadAudio);

// Get the download thumbnail button
const downloadThumbnailButton = document.getElementById("download-thumbnail");
downloadThumbnailButton.addEventListener("click", downloadThumbnail);

// Get the options button
const optionsButton = document.getElementById("options");
optionsButton.addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // since only one tab should be active and in the current window at once
    // the return variable should only have one entry
    const activeTab = tabs[0];
    const url = activeTab.url;

    const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu\.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]{11})((?:\?|\&)\S+)?$/;

    const match = url.match(regex);
    
    if (match) {
        videoId = match[6];
        
        downloadVideoButton.disabled = false;
        downloadAudioButton.disabled = false;
        downloadThumbnailButton.disabled = false;
    }
});

chrome.runtime.sendMessage({
    type: 'status',
    format: 'audio',
}).then((response) => {
    if (response.downloading && videoId) {
        downloadAudioButton.disabled = true;
        downloadAudioButton.setAttribute('downloading', '');
    }
})

chrome.runtime.sendMessage({
    type: 'status',
    format: 'video',
}).then((response) => {
    if (response.downloading && videoId) {
        downloadVideoButton.disabled = true;
        downloadVideoButton.setAttribute('downloading', '');
    }
})

chrome.runtime.sendMessage({
    type: 'status',
    format: 'thumbnail',
}).then((response) => {
    if (response.downloading && videoId) {
        downloadThumbnailButton.disabled = true;
        downloadThumbnailButton.setAttribute('downloading', '');
    }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'status') {
        if (message.format === 'audio') {
            if (!message.downloading && videoId) {
                downloadAudioButton.disabled = false;
                downloadAudioButton.removeAttribute('downloading');
            }
        }

        if (message.format === 'video') {
            if (!message.downloading && videoId) {
                downloadVideoButton.disabled = false;
                downloadVideoButton.removeAttribute('downloading');
            }
        }
        
        if (message.format === 'thumbnail') {
            if (!message.downloading && videoId) {
                downloadThumbnailButton.disabled = false;
                downloadThumbnailButton.removeAttribute('downloading');
            }
        }
    }
});

function downloadVideo() {
    downloadVideoButton.disabled = true;
    downloadVideoButton.setAttribute('downloading', '');

    chrome.runtime.sendMessage({
        type: 'download',
        format: 'video',
        videoId: videoId
    });
}

function downloadAudio() {
    downloadAudioButton.disabled = true;
    downloadAudioButton.setAttribute('downloading', '');
    
    chrome.runtime.sendMessage({
        type: 'download',
        format: 'audio',
        videoId: videoId
    });
}

function downloadThumbnail() {
    downloadThumbnailButton.disabled = true;
    downloadThumbnailButton.setAttribute('downloading', '');
    
    chrome.runtime.sendMessage({
        type: 'download',
        format: 'thumbnail',
        videoId: videoId
    });
}