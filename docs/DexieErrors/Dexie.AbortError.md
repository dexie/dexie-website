---
layout: docs
title: 'Dexie.AbortError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.AbortError

### Description 

Happens when the transaction was aborted. When this happens, it can be a result of an earlier uncaught exception that made the transaction abort. 
It will also happen when calling [Transaction.abort()](/docs/Transaction/Transaction.abort()). To find out more about the abort reason, try look in the
console log for earlier exceptions to see the reason behind it.

**NOTICE!** When catching AbortError, always inspect the property `inner` to gain more information about the reason why the transaction was aborted.

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch('AbortError', e => {
    // Failed with AbortError.
    if (e.inner) {
        // Inspect inner error to find the reason behind why the transaction was aborted.
        if (e.inner.name === 'QuotaExceededError') {
            console.error ("Transaction aborted due to QuotaExceededError");
        } else {
            console.error ("Abort error due to " + e.inner);
        }
    } else {
        console.error ("Abort error " + e.message);
    }
}).catch(Error, e => {
    // Any other error derived from standard Error
    console.error ("Error: " + e.message);
}).catch(e => {
    // Other error such as a string was thrown
    console.error (e);
});
```

### Sample: switch(error.name)

```javascript
db.on('error', function (error) {
    switch (error.inner ? error.inner.name : error.name) {
        // errnames.Abort ==="AbortError"
        case Dexie.errnames.Abort:
            console.error ("Abort error");
            break;
        case Dexie.errnames.QuotaExceededError:
            console.error ("Quota exceeded");
            break;
        default:
            console.error ("error: " + e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.Abort === "AbortError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thown. If signaled, there wont be any call stack.</td></tr>
</table>
