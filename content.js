if (document.readyState === "loading") {
  console.log("DOM Loading!");
  setLocal();
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Finished Loading!");
});

window.addEventListener("load", () => {
  console.log("Page Finished Loading!");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.mode === "on") {
    setLocal();
    sendResponse({ msg: "goodbye" });
  }
});

function setLocal() {
  localStorage.setItem("user-access", '{"timeRemaining":1}');
  getLocal();
}

function getLocal() {
  const val = localStorage.getItem("user-access");
  console.log(val);
  return val;
}
