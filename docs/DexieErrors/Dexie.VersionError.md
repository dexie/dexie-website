---
layout: docs
title: 'Dexie.VersionError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.VersionError

### Description 

This error is thrown when the installed version of the database is higher than the version passed to [Dexie.version()](/docs/Dexie/Dexie.version()). The error is a native error from IndexedDB and will show the conflicting native version numbers in the message.

Since dexie@4.0.1-beta.8, this error is no longer expected to happen because Dexie will silently adapt to the installed version in the background. This makes it possible to revert to an earlier version of the database without getting into the situation of VersionError being thrown.

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
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
