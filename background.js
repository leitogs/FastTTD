function reddenPage() {
  document.body.style.backgroundColor = "red";
  console.log("Clicked");
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: reddenPage,
  });
});

// "web_accessible_resources": [
//   {
//     "resources": ["icon/*"],
//     "matches": ["<all_urls>"]
//   }
// ]
