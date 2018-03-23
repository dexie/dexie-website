---
layout: docs
title: 'Dexie.VersionError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.VersionError

### Description 

TBD...

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch('VersionError', e => {
    // Failed with VersionError
    console.error ("Version error: " + e.message);
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
        // errnames.Version ==="VersionError"
        case Dexie.errnames.Version:
            console.error ("Version error");
            break;
        default:
            console.error ("error: " + e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.Version === "VersionError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thown. If signaled, there wont be any call stack.</td></tr>
</table>
