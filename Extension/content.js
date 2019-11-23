console.log('content.js starting here');

function videoEndedHandler() {
    console.log("video is ended");
    //send message to background script when video is ended
    chrome.runtime.sendMessage({name: "setTimer"}, function (response) {
        console.log('message response : ' + response.msg);
    });
}

//get video element from page
function findVideo() {
    return document.getElementsByTagName('video')[0];
}

function handling() {
    chrome.storage.local.get(["isRun"], function (result) {
        //check that extension is active
        let isRun = result.isRun;
        console.log('status: ' + isRun);
        if (isRun) {
            if (videoEl === undefined || videoEl !== findVideo()) {
                videoEl = findVideo();
                if (videoEl) {
                    console.log("videoEl is found");
                    videoEl.addEventListener('ended', videoEndedHandler);
                    console.log("New listener is created");
                } else {
                    console.log('no video there');
                }
            } else {
                console.log('video already caught');
            }
        }
    });
}

let videoEl;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    handling();
    sendResponse({msg: "OK"});
});






