//bypasses waiting timer pages
localStorage.setItem("user-access", '{"timeRemaining":-1}');
localStorage.setItem("c_timer", "-1");

//injects script into main-site
const s = document.createElement("script");
s.src = chrome.runtime.getURL("src/inject/index.js");
document.documentElement.appendChild(s);

//receives events from injected script(src/inject/index.ts)
setCaptchaListener();

window.onpopstate = (e) => {
  //checks true to covid-19 norms checkbox in /slot-booking page
  checkTnC_SED();
  //skips terms and conditions pages in online seva
  skipOnlineSevaTnCPages();
};

window.onload = () => {
  checkTnC_SED();
  skipOnlineSevaTnCPages();
};

chrome.storage.local.get(["isEnabled", "isOTPEnabled", "userID"], (data) => {
  if (data.userID && data.isOTPEnabled && data.isEnabled) {
    connectSSE(data.userID);
  }
});

chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(["isEnabled", "isOTPEnabled", "userID"], (data) => {
    if (data.userID && data.isOTPEnabled && data.isEnabled) {
      connectSSE(data.userID);
    } else if (eventSource) {
      eventSource.close();
    }
  });
});

function setCaptchaListener() {
  window.addEventListener(
    "captcha",
    (data: any) => {
      console.log(data.detail);
      if (isMainSite()) {
        const loginCaptchaInput = document.getElementById("txtInput");
        setInput(loginCaptchaInput, data.detail);
      } else {
        const captchaInput = document.getElementsByName("captcha")[0];
        setInput(captchaInput, data.detail);
      }
    },
    false
  );
}

function checkTnC_SED() {
  if (isMainSite()) return;
  const observer = new MutationObserver((mutation) => {
    mutation.forEach((element) => {
      if (window.location.pathname !== "/slot-booking") return;
      const imgURL =
        "https://online.tirupatibalaji.ap.gov.in/checkbox_unselect.png";
      const img = element.addedNodes[0]?.childNodes[6]
        ?.childNodes[0] as HTMLImageElement;
      if (img?.src === imgURL) {
        img?.click();
      }
    });
  });
  observer.observe(document.getElementById("__next") as Node, {
    attributes: true,
    childList: true,
    subtree: true,
  });
}

function skipOnlineSevaTnCPages() {
  if (window.location.hash !== ("#/welcome" && "#/login")) return;
  const observer = new MutationObserver((mutation) => {
    mutation.forEach((element) => {
      if (element.type === "childList" && element.addedNodes.length) {
        const target = element.target as HTMLElement;
        if (target.id === "container") {
          const parentDiv = target?.children[7]?.children[0]?.children[1];
          const parentDivHomePage = target?.children[8]?.children[10];
          if (parentDiv) {
            const virSeva =
              parentDiv.children[2].children[0].children[12].children[1];
            const tirumala = virSeva.children[0]
              .firstChild as HTMLAnchorElement;
            const tiruchanoor = virSeva.children[1]
              .firstChild as HTMLAnchorElement;
            const srinivasamangapuram = virSeva.children[2]
              .firstChild as HTMLAnchorElement;
            tirumala.href = "#/virtualSevaCal";
            tiruchanoor.href = "#/virtualPATSevaCal";
            srinivasamangapuram.href = "#/virtualSevaSriKalyanaCal";
          }
          if (parentDivHomePage) {
            const virSevaHomePage =
              parentDivHomePage?.children[2]?.children[0]?.children[3]
                ?.children[1];
            const tirumalaHomePage = virSevaHomePage?.children[0]
              ?.firstChild as HTMLAnchorElement;
            const tiruchanoorHomePage = virSevaHomePage?.children[1]
              ?.firstChild as HTMLAnchorElement;
            const srinivasamangapuramHomePage = virSevaHomePage?.children[2]
              ?.firstChild as HTMLAnchorElement;
            tirumalaHomePage.href = "#/virtualSevaCal";
            tiruchanoorHomePage.href = "#/virtualPATSevaCal";
            srinivasamangapuramHomePage.href = "#/virtualSevaSriKalyanaCal";
          }
        }
      }
    });
  });
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
  });
}

let eventSource: EventSource;
function connectSSE(userID: string) {
  const path = window.location.pathname;
  if (!isMainSite() && (path === "/login" || path === "/accommodation/login")) {
    eventSource?.close();
    eventSource = new EventSource(`${import.meta.env.VITE_SSE_URL}${userID}`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
    };
    eventSource.onerror = (event) => {
      console.log(event);
      if (eventSource.readyState == EventSource.CLOSED) {
        console.log("SSE CLOSED ON ERROR");
      }
    };
    eventSource.onopen = (event) => {
      console.log("SSE OPENED");
    };
    eventSource.addEventListener("ping", (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
    });
    eventSource.addEventListener(userID, (event) => {
      console.log(event.data);
      const { code } = JSON.parse(event.data);
      const otp = document.getElementsByName("otp");
      if (otp.length) {
        setInput(otp[0], code);
      }
    });
    return eventSource;
  }
}

function setInput(el: HTMLElement | null, val: any) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;
  nativeInputValueSetter?.call(el, val);
  const ev2 = new Event("input", { bubbles: true });
  el?.dispatchEvent(ev2);
}

function isMainSite() {
  const url = window.location.host;
  const site = "tirupatibalaji.ap.gov.in";
  return url === site;
}
