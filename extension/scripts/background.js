// TODO: Download in the background, so you can close the popup or go to a different tab while its working

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