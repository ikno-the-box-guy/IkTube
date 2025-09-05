/**
 * @param {string} endpoint
 * @param {string} videoId
 * @returns {Promise<string>}
 */
function getUrl(endpoint, videoId) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(
            {apiAddress: ''},
            (items) => {
                const address = items.apiAddress;
                
                if (!address) {
                    reject('No API address set');
                    return;
                }
                
                const baseAddress = address.trim().replace(/\/$/, '');
                
                resolve(`${baseAddress}/api/v1/${endpoint}/${videoId}`);
            }
        );
    });
}



/*  
 *  TODO: Needs MUCH better error handling
 *  
 *  It is nearly impossible for the user to tell what went wrong
 *  Communicate whether or not the issue is with the set API address or the download itself
 *  (e.g. "Invalid URL" vs "Failed to download video")
 *
 */

async function download(type, videoId) {
    downloading.set(type, true);
    
    try {
        const url = await getUrl(type, videoId);
        
        await new Promise((resolve) => {
            chrome.downloads.download({
                url: url,
                saveAs: false
            }, (downloadId) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                }
                
                resolve();
            });
        })
    } catch (error) {
        console.error(error);
    } finally {
        downloading.delete(type);

        chrome.runtime.sendMessage({
            type: 'status',
            format: type,
            downloading: false
        })
    }
}

// Create a map to keep track of what is currently being downloaded
const downloading = new Map();

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === 'download') {
        await download(message.format, message.videoId);
    }
    
    if (message.type === 'status') {
        sendResponse({downloading: downloading.has(message.format)});
    }
});


// Fetch video info when new youtube page is opened
// background.js

const videoInfo = {};

// Called when a page finishes loading
chrome.webNavigation.onCompleted.addListener(async (details) => {
    const { tabId, url, frameId } = details;

    if (frameId !== 0) return; // only handle top-level frame
    
    // Check if the URL is a YouTube video
    const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu\.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]{11})((?:\?|\&)\S+)?$/;
    const match = url.match(regex);

    if (!match) {
        return;
    }
    
    videoId = match[6];
    console.log(`Tab ${tabId} opened a YouTube video: ${videoId}`);
    
    // Optional: clear old data if you're not overwriting it
    videoInfo[tabId] = null;

    // Fetch and store data for this tab based on URL
    const apiUrl = await getUrl('info', videoId);
    const response = await fetch(apiUrl);
    videoInfo[tabId] = await response.json();
    
    console.log(`Video info for tab ${tabId}:`, videoInfo[tabId]);
});

// Clean up data when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    console.log(`Tab ${tabId} closed, cleaning up data.`);
    
    delete videoInfo[tabId];
});

// Optional: get data from content script or popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'getTabData') {
        const tabId = msg.tabId;
        
        console.log(`Requesting data for tab ${tabId}:`, videoInfo[tabId]);
        
        sendResponse(videoInfo[tabId] || null);
    }
});
