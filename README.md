# FastTTD

Chrome extension to simplify [site1](http://tirupatibalaji.ap.gov.in/) and [site2](https://online.tirupatibalaji.ap.gov.in/login?) login process.

# Features

- Skips Waiting Timer.
- Solves Captcha's.
- Skips Terms and Conditions Pages.
- Receives and Set OTP automatically. (**Requires App**) (**optional**).

# Usage

### Install

<code>npm install</code>

### Development

<code>npm run dev</code>

### Build

<code>npm run build</code>

Builds and outputs to **_dist_** folder.<br>

Use **_dist_** folder as **_load unpacked_** in **chrome://extensions**.

### Pack (optional)

<code>npm run zip</code><br>

:memo: **Note:** Requires **_zip_** package to be installed in your device.<br>( or )<br>Manually archive **_dist_** folder.<br>

Use archived **_dist_** folder **FastTTD.zip** to load it in [Kiwi browser](https://github.com/kiwibrowser/src/releases) for Mobile.

# Environment Variable (optional)

Required only if you need to receive OTP.

<code>VITE_SSE_URL="sse host url"</code>

# Example

[![Example](/Example.png "Example")](https://github.com/leitogs/FastTTD/Example.png)

1. Turn **ON** to:

   - Skip Waiting Timer.
   - Solve Captcha.
   - Skip Terms and Conditions.

2. (**optional**) Turn **ON** to:

   - Receive OTP.

3. **User** value should be same as the value provided in the APP.<br>
   :memo: **Note:** Must **required** to receive OTP.

## HOW IT WORKS?

When the extension is turned **ON**, [Service Worker (Background Script)](https://developer.chrome.com/docs/extensions/mv3/service_workers/) registers and loads the [Content Script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) and [injects](https://developer.chrome.com/docs/extensions/mv3/content_scripts/#dynamic-declarative) the _src/inject/index.ts_ script to the main site.<br>The Injected script override's the native [CanvasRenderingContext2D.fillText()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) method. So, When the main site sets the captcha value by calling the already overridden method _CanvasRenderingContext2D.fillText()_ it gets the captcha value and sends it back to the _Content script_ using [Window.dispatchEvent()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent).<br> Then, The _Content script_ receives the Captcha value using custom event listener **setCaptchaListener()** and sets the value to the main site's captcha input.<br>
Server Sent Events [(Event Source)](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) are used to receive OTP and other feature's are using [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to detect [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) changes and update the DOM.
