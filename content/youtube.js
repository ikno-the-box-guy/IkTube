function onClick (e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    let videoId = window.location.search.split("v=")[1];
    const ampersandPosition = videoId.indexOf("&");
    if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
    }

    console.log("Video ID: ", videoId);
}

function onLoaded(downloadPopup) {
    /*// Replace premium logo
    const logoContainer = downloadPopup.getElementsByTagName("yt-icon")[0];
    const logoDiv = logoContainer.children[0].children[0];
    const logoSvg = logoDiv.children[0];
    // Remove premium text
    logoSvg.children[1].remove();
    // Create new text <text font-family="Arial" font-size="25" fill="white" letter-spacing="-1" y="20px" x="32px" text-length="100%¨ font-family=">IkTube</text>
    const ikTubeLogo = document.createElement("text");
    ikTubeLogo.setAttribute("font-family", "Arial");
    ikTubeLogo.setAttribute("font-size", "25");
    ikTubeLogo.setAttribute("fill", "white");
    ikTubeLogo.setAttribute("letter-spacing", "-1");
    ikTubeLogo.setAttribute("y", "20px");
    ikTubeLogo.setAttribute("x", "32px");
    // ikTubeLogo.setAttribute("text-length", "100%");
    ikTubeLogo.innerHTML = "IkTube";
    // Replace text
    logoSvg.appendChild(ikTubeLogo);

    const title = downloadPopup.getElementsByTagName("yt-formatted-string")[0];
    title.innerHTML = "Download";*/
    
    
    // Replace downloadpopup html with html from downloadpopup.html
    fetch(chrome.runtime.getURL('download.html'))
        .then(response => response.text())
        .then(html => {
            downloadPopup.innerHTML = html;
        })
        .catch(error => console.error('Error loading HTML:', error));
}

const observer = new MutationObserver(function (mutations, mutationInstance) {
    const downloadPopup = document.getElementsByTagName("ytd-offline-promo-renderer")[0];
    if (downloadPopup) {
        onLoaded(downloadPopup);
        mutationInstance.disconnect();
    }
});


observer.observe(document, {
    childList: true,
    subtree:   true
});

// document.getElementsByTagName("ytd-menu-service-item-download-renderer")[0]
// .getElementsByTagName("tp-yt-paper-item")[0]
// .addEventListener("click", function () {
//     console.log("Youtube.js loaded");
// });