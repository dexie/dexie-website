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

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch('AbortError', e => {
    // Failed with AbortError
    console.error ("Abort error: " + e.message);
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
    switch (error.name) {
        // errnames.Abort ==="AbortError"
        case Dexie.errnames.Abort:
            console.error ("Abort error");
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
