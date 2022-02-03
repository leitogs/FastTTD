(() => {
  setLocal();
})();

const cbl = initCBL();

if (document.readyState !== "complete") {
  window.addEventListener("load", () => {
    console.log("Page Finished Loading!");
    console.log("isMobile: " + isMobile);
    console.log("isMain " + isLogin);
    setTimeout(onDarshan, 2500);
    setTimeout(setListener, 2500);
    setTimeout(onLogin, 100);
    setTimeout(onLoginRefresh, 100);
  });
}

async function onLogin() {
  if (isLogin) {
    const loginCaptchaInput = document.getElementById("txtInput");
    await cbl.solve("captcha").done(function (solution) {
      setInput(loginCaptchaInput, solution);
    });
  }
}

async function onDarshan() {
  if (!isLogin) {
    const captchaInput = document.getElementsByName("captcha")[0];
    const captcha = document.getElementById("captcha");
    const canvas = captcha.childNodes[0];
    await canvas.toBlob((blob) => {
      const imgData = URL.createObjectURL(blob);
      cbl.solve(imgData).done(function (solution) {
        setInput(captchaInput, solution);
      });
    }, 1);
  }
}

function setListener() {
  if (!isLogin) {
    const captcha = document.getElementById("captcha");
    const refresh = captcha.parentNode.lastChild.lastChild.childNodes[0];
    refresh.addEventListener("click", () => {
      setTimeout(onDarshan, 5);
    });
  }
}

function onLoginRefresh() {
  if (isLogin) {
    const captchaRefresh =
      document.getElementById("txtInput").parentNode.childNodes[5];
    captchaRefresh.addEventListener("click", () => {
      setTimeout(onLogin, 5);
    });
  }
}

function setLocal() {
  localStorage.setItem("user-access", '{"timeRemaining":1}');
  getLocal();
}

function getLocal() {
  const val = localStorage.getItem("user-access");
  return val;
}

function setInput(el, val) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  nativeInputValueSetter.call(el, val);
  const ev2 = new Event("input", { bubbles: true });
  el.dispatchEvent(ev2);
}
