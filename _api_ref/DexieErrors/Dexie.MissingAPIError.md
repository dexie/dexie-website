---
layout: docs
title: 'Dexie.MissingAPIError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.MissingAPIError

### Description 

Happens when indexedDB API could not be found when trying to open database.

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(function() {
    // Success
}).catch(Dexie.MissingAPIError, function (e) {
    // Failed with MissingAPIError
    console.error ("MissingAPI error: " + e.message);
}).catch(Error, function (e) {
    // Any other error derived from standard Error
    console.error ("Error: " + e.message);
}).catch(function (e) {
    // Other error such as a string was thrown
    console.error (e);
});
```

### Sample: switch(error.name)

```javascript
db.on('error', function (error) {
    switch (error.name) {
        // errnames.MissingAPI ==="MissingAPIError"
        case Dexie.errnames.MissingAPI:
            console.error ("MissingAPI error");
            break;
        default:
            console.error ("error: " + e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.MissingAPI === "MissingAPIError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thown. If signaled, there wont be any call stack.</td></tr>
</table>
