---
layout: docs
title: 'Dexie.SchemaError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.SchemaError

### Description 

Happens when the database schema has errors.

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(function(){
    // Success
}).catch(Dexie.SchemaError, function (e) {
    // Failed with SchemaError
    console.error ("Schema error: " + e.message);
}).catch(Error, funtion (e) {
    // Any other error derived from standard Error
    console.error ("Error: " + e.message);
}).catch(funtion (e) {
    // Other error such as a string was thrown
    console.error (e);
});
```

### Sample using switch(error.name)

```javascript
db.on('error', function (error) {
    switch (error.name) {
        case Dexie.errnames.Schema:
            console.error ("Schemad error");
            break;
        default:
            console.error ("error: " + e.message);
    }
});
```
### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.Schema === "SchemaError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thown. If signaled, there wont be any call stack.</td></tr>
</table>
