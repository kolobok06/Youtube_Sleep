//get controls from page
const swRun = document.getElementById("swRun");
const selDelay = document.getElementById("selDelay");
const selAction = document.getElementById("selAction");

function saveSwitch() {
    chrome.storage.local.set({isRun: swRun.checked})
}

function saveDelay() {
    chrome.storage.local.set({
        delay: parseFloat(selDelay.options[selDelay.selectedIndex].value),
        delayId: selDelay.selectedIndex
    })
}

function saveAction() {
    chrome.storage.local.set({
        action: selAction.options[selAction.selectedIndex].value,
        actionId: selAction.selectedIndex
    })
}

//save default data
saveSwitch();
saveDelay();
saveAction();

//set handlers for controls to update data in storage when user change them
swRun.addEventListener("click", saveSwitch);
selDelay.addEventListener("change", saveDelay);
selAction.addEventListener("change", saveAction);

//set data in controls from storage. exec when popup is show up
chrome.storage.local.get(["isRun", "delayId", "actionId"], function (result) {
    if (result) {
        swRun.checked = result.isRun;
        selDelay.selectedIndex = result.delayId;
        selAction.selectedIndex = result.actionId;
    }
});