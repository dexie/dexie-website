---
layout: docs
title: 'Dexie.DataCloneError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.DataCloneError

### Description 

An attempt to add or put an item into the database was made, where the object contained a strucure not supported by the
[Structured Cloning](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) algorithm, such as a Function or Error object.

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch('DataCloneError', e => {
    // Failed with DataCloneError
    console.error ("DataClone error: " + e.message);
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
        // errnames.DataClone ==="DataCloneError"
        case Dexie.errnames.DataClone:
            console.error ("DataClone error");
            break;
        default:
            console.error ("error: " + e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.DataClone === "DataCloneError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thown. If signaled, there wont be any call stack.</td></tr>
</table>
