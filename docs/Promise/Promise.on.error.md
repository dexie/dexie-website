---
layout: docs
title: 'Promise.on.error'
---

### Description
Global exception handler for non-catched promises. 

_Deprecated Since Dexie 1.5.1. Obsolete since 2.0.0. Use onunhandledrejection instead_

### Subscibe

```javascript
Dexie.Promise.on("error", myGlobalErrorHandler);

function myGlobalErrorHandler(error) {
    console.error(error);
    return false; // Returning false will prevent the default handler from being called.
}
```

### Unsubscribe

```javascript
Dexie.Promise.on("error").unsubscribe(myGlobalErrorHandler);
```

### Parameters
<table>
<tr><td>error: Any</td><td>Any uncatched error no matter if it was a DB operation or any other non-db operation.</td></tr>
</table>

### Remarks
This event will fire whenever a Dexie.Promise instance was rejected bug never catched. Returning false from your handler will prevent any earlier registered handler from being called. By default there is a handler that logs each unhandled promise to the console with `console.warn()`. Your handler will execute before the default handler. If you want to silence the default handler, return false from your handler.

### Sample

```javascript
Dexie.Promise.on("error", function (e) {
    var errorLabel = document.getElementByIf('errorLabel');
    if (errorLabel) {
        errorLabel.innerText = e.stack || e;
        return false;
    }
});

new Dexie.Promise(function () {
    throw "Oops!";
});

// promise not catched, so the error will bubble to Dexie.Promise.on('error').

```

