chrome.webNavigation.onCompleted.addListener(function (details) {
    console.log('tab ' + details.tabId + ' updated');
    //send message to content script when page is updated
    chrome.tabs.sendMessage(details.tabId, {msg: "updated"}, function (response) {
        console.log('cs response: ' + response.msg);
    })
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //message from content script says that video is ended
    if (request.name === "setTimer") {
        console.log("from a content script:" + sender.tab.url);
        let delay;
        chrome.storage.local.get(["delay"], function (result) {
            //get delay value from local storage
            delay = result.delay;
            //set alarm
            chrome.alarms.create({delayInMinutes: delay});
            console.log('alarm set to: ' + delay);
            //notify the user, alarm can be canceled
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon256.png',
                title: 'Attention!',
                message: 'The computer will turn off after ' + delay + ' minutes',
                buttons: [
                    {title: 'Cancel'}
                ],
                silent: true
            });
        });
        //message is sync
        sendResponse({msg: "OK"});
    }
});

chrome.notifications.onButtonClicked.addListener(function () {
    //when user click the 'cancel' button of notification, cancel all alarms
    chrome.alarms.clearAll();
    console.log('alarms cleared');
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log('alarm');
    //alarm is fired, send native message to run *.bat
    chrome.storage.local.get(["action"], function (result) {
        console.log('run action: ' + result.action);
        if (result.action === 'shutdown') {
            chrome.extension.connectNative('com.youtube_sleep.shutdown');
        } else if (result.action === 'suspend') {
            console.log('alarm');
            chrome.extension.connectNative('com.youtube_sleep.suspend');
        } else if (result.action === 'hibernate') {
            console.log('alarm');
            chrome.extension.connectNative('com.youtube_sleep.hibernate');
        }
    });
});
