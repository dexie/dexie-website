---
layout: docs
title: 'Dexie.QuotaExceededError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.QuotaExceededError

### Description 

The storage quota for the current origin was exceeded. To learn more about storage quota, see [Storage Manager API](/docs/StorageManager).

**NOTICE** This error may occur as the **inner** exception of an [AbortError](Dexie.AbortError) on some browsers, as the transaction is aborted instead of onerror being signaled. To catch this error properly, always inspect `error.inner` on [AbortError](Dexie.AbortError).

### Sample

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch(e => {
    if ((e.name === 'QuotaExceededError') ||
        (e.inner && e.inner.name === 'QuotaExceededError'))
    {
      // QuotaExceededError may occur as the inner error of an AbortError
      console.error ("QuotaExceeded error!");
    } else {
      // Any other error
      console.error (e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.QuotaExceeded === "QuotaExceededError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
