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

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch('QuotaExceededError', e => {
    // Failed with QuotaExceededError
    console.error ("QuotaExceeded error: " + e.message);
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
        // errnames.QuotaExceeded ==="QuotaExceededError"
        case Dexie.errnames.QuotaExceeded:
            console.error ("QuotaExceeded error");
            break;
        default:
            console.error ("error: " + e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.QuotaExceeded === "QuotaExceededError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thown. If signaled, there wont be any call stack.</td></tr>
</table>
