---
layout: docs
title: 'Dexie.DatabaseClosedError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.DatabaseClosedError

### Description 

The database connection has been closed explicitly, by calling [db.close()](/docs/Dexie/Dexie.close()), or it was opened with option `{autoOpen: false}` and [db.open()](/docs/Dexie/Dexie.open())
was not yet called upon.

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch('DatabaseClosedError', e => {
    // Failed with DatabaseClosedError
    console.error ("DatabaseClosed error: " + e.message);
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
        // errnames.DatabaseClosed ==="DatabaseClosedError"
        case Dexie.errnames.DatabaseClosed:
            console.error ("DatabaseClosed error");
            break;
        default:
            console.error ("error: " + error);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.DatabaseClosed === "DatabaseClosedError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
