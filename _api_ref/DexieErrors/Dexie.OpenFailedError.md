---
layout: docs
title: 'Dexie.OpenFailedError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.OpenFailedError

### Description 

Happens when a db operation has failed due to that database couldn't be opened.

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(function(){
    // Success
}).catch(Dexie.OpenFailedError, function (e) {
    // Failed with OpenFailedError
    console.error ("open failed: " + e.message);
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
        case Dexie.errnames.OpenFailed:
            console.log ("open failed");
            break;
        default:
            console.log ("error: " + e.message);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.OpenFailed === "OpenFailedError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thown. If signaled, there wont be any call stack.</td></tr>
</table>
