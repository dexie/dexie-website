---
layout: docs
title: 'Dexie.UpgradeError()'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.UpgradeError

### Description 

Happens when the database could not be upgraded.

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(function(){
    // Success
}).catch(Dexie.UpgradeError, function (e) {
    // Failed with UpgradeError
    console.error ("Upgrade error: " + e.message);
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
        // errnames.Upgrade ==="UpgradeError"
        case Dexie.errnames.Upgrade:
            console.error ("Upgrade error");
            break;
        default:
            console.error ("error: " + e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.Upgrade === "UpgradeError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
