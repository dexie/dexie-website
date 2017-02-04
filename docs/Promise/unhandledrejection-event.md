---
layout: docs
title: 'unhandledrejection-event'
---

## Description

Standardized DOM event triggered when you forget to catch your promises and an error occurred that your code never caught.

[https://developer.mozilla.org/en-US/docs/Web/Events/unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/Events/unhandledrejection)

From Dexie v1.5.0, you can use this standardized event to log or display unhandled rejections in your code.

## Sample

```javascript
function handler (event) {
  event.preventDefault(); // Prevents default handler (would log to console).
  let reason = event.reason;
  console.warn('Unhandled promise rejection:', (reason && (reason.stack || reason)));
};

window.addEventListener ('unhandledrejection', handler);
```

Alternatively, if you're at your app's bootstrap code and never plan to remove the event listener, use a simpler approach:

```javascript
window.onunhandledrejection = function (event) {
  event.preventDefault();
  let reason = event.reason;
  console.warn('Unhandled promise rejection:', (reason && (reason.stack || reason)));
};
```

## Compatibility

Even though this event is only natively supported by the newest Chromium and Edge browsers, the samples above will still work on all browsers including IE10, IE11, Safari, Chrome, Opera, Firefox and Edge if you are using Dexie promises, because unhandled Dexie Promises will manually trigger this event.

