let mode = false;

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const btnSwitch = document.getElementById("flexSwitchCheckDefault");
    let label = document.getElementById("label");
    btnSwitch.addEventListener(
      "click",
      () => {
        mode = !mode;
        scrMode(mode, label);
      },
      false
    );
  },
  false
);

function scrMode(mode, label) {
  if (mode) {
    const tabId = getCurrentTab();
    sendMessage(tabId);
    label.innerHTML = "Stop Script";
  } else {
    label.innerHTML = "Run Script";
  }
}

function getCurrentTab() {
  let tab;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tab = tabs[0].id;
  });
  return tab;
}

function sendMessage(id) {
  chrome.tabs.sendMessage(id, { mode: "on" }, (response) => {
    if (!chrome.runtime.lastError) {
      console.log(response.msg);
    } else {
      console.log("Error!");
    }
  });
}
