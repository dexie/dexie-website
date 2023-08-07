---
layout: docs
title: 'Dexie.InvalidStateError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.InvalidStateError

### Description 

Can happen when trying to use IndexedDB resource when not in a valid state to do so. For example, calling [db.transaction()](/docs/Dexie/Dexie.transaction()) from within an [upgrade](/docs/Version/Version.upgrade()) callback (when current transaction is an upgrade transaction.)

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch('InvalidStateError', e => {
    // Failed with InvalidStateError
    console.error ("InvalidState error: " + e.message);
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
        // errnames.InvalidState ==="InvalidStateError"
        case Dexie.errnames.InvalidState:
            console.error ("InvalidState error");
            break;
        default:
            console.error ("error: " + error);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.InvalidState === "InvalidStateError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
