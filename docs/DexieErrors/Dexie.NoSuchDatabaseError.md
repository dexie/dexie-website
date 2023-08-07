---
layout: docs
title: 'Dexie.NoSuchDatabaseErrorError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.NoSuchDatabaseErrorError

### Description 

If [db.version(X)](/docs/Dexie/Dexie.version()) was not called before interacting the first time with the database, it is considered to be opened in dynamic mode, which basically means it may just open existing databases. If the database name provided does not exist in db.open(), it will fail with NoSuchDatabaseError.

### Sample using Promise.catch()

```javascript
const db = new Dexie('non-existing-db');
db.open().then(result => {
    // Success
}).catch('NoSuchDatabaseErrorError', e => {
    // Failed with NoSuchDatabaseErrorError
    console.error ("NoSuchDatabaseError error: " + e.message);
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
        // errnames.NoSuchDatabaseError ==="NoSuchDatabaseErrorError"
        case Dexie.errnames.NoSuchDatabaseError:
            console.error ("NoSuchDatabaseError error");
            break;
        default:
            console.error ("error: " + e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.NoSuchDatabaseError === "NoSuchDatabaseErrorError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
