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

### Sample

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch(e => {
    return handleError(e);
});

function handleError(e) {
    switch (e.name) {
      case "AbortError":
        if (e.inner) {
          return handleError(e.inner);
        }
        console.error ("Abort error " + e.message);
        break;
      case "QuotaExceededError":
        console.error ("QuotaExceededError " + e.message);
        break;
      default:
        console.error (e);
        break;
    }
 }
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.Abort === "AbortError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
