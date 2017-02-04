---
layout: docs
title: 'Dexie.VersionChangeError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](DexieError)
    * Dexie.VersionChangeError

### Description 

Happens when another database instance deletes or upgrades the database so that the own instance had to be closed. The host wep app is probably not in sync with the latest version of the database. A typical solution is for the current web app to be updated from the server.

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(function(){
    // Success
}).catch(Dexie.VersionChangeError, function (e) {
    // Failed with VersionChangeError
    console.error ("VersionChange error: " + e.message);
}).catch(Error, funtion (e) {
    // Any other error derived from standard Error
    console.error ("Error: " + e.message);
}).catch(funtion (e) {
    // Other error such as a string was thrown
    console.error (e);
});
```

### Sample: switch(error.name)
```javascript
db.on('error', function (error) {
    switch (error.name) {
        case Dexie.errnames.VersionChange:
            console.error ("VersionChanged error");
            break;
        default:
            console.error ("error: " + e.message);
    }
});
```
### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.VersionChange === "VersionChangeError"</tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thown. If signaled, there wont be any call stack.</td></tr>
</table>

### See Also

[Dexie.on.versionchange](Dexie.on.versionchange)
