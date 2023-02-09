const originalCanvasRenderingContext =
  CanvasRenderingContext2D.prototype.fillText;

let count = 0;
let captcha = "";

CanvasRenderingContext2D.prototype.fillText = function () {
  originalCanvasRenderingContext.apply(this, arguments as any);
  console.log("Detected canvas");
  if (window.location.pathname === "/login") {
    const text = arguments[0].split(" ").join("");
    captcha = text;
    sendEvent();
    return;
  }
  if (window.location.hash === "#/login") {
    count++;
    captcha += arguments[0];
    if (count === 7) {
      sendEvent();
      count = 0;
      captcha = "";
      return;
    }
  }
};

function sendEvent() {
  window.dispatchEvent(new CustomEvent("captcha", { detail: captcha }));
}
