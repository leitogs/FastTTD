chrome.storage.local.get(["isEnabled"], (data) => {
  if (data.isEnabled) {
    console.log("get");
    registerContentScript();
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.hasOwnProperty("isEnabled")) {
    if (changes["isEnabled"].newValue) {
      registerContentScript();
    } else {
      unregisterContentScripts("enableApp");
    }
  }
});

async function registerContentScript() {
  chrome.scripting.getRegisteredContentScripts().then((scripts) => {
    if (scripts.length) {
      const ids = scripts.map((script) => script.id);
      if (!ids.includes("enableApp")) {
        register();
      }
    } else {
      register();
    }
  });
}

async function register() {
  const appConfig: chrome.scripting.RegisteredContentScript = {
    id: "enableApp",
    js: ["src/content/index.js"],
    matches: [
      "https://online.tirupatibalaji.ap.gov.in/*",
      "https://tirupatibalaji.ap.gov.in/*",
    ],
    persistAcrossSessions: true,
    runAt: "document_start",
  };
  try {
    await chrome.scripting.registerContentScripts([appConfig]);
  } catch (err) {
    console.log(err);
  }
}

async function unregisterContentScripts(id: string) {
  try {
    await chrome.scripting.unregisterContentScripts({
      ids: [id],
    });
  } catch (err) {
    console.error(`failed to unregister content scripts: ${err}`);
  }
}
