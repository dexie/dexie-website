---
layout: docs
title: 'Dexie.InvalidArgumentError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.InvalidArgumentError

### Description 

A Dexie method was called with one or more invalid arguments. For example:

* calling [db.delete(someArgument)](/docs/Dexie/Dexie.delete()) with arguments (as the method requires no arguments being passed to it)
* calling [db.transaction()](/docs/Dexie/Dexie.transaction()) with no table arguments.
* calling [db.transaction()](/docs/Dexie/Dexie.transaction()) with an invalid transaction mode
* calling [Table.bulkPut()](/docs/Table/Table.bulkPut()) or [Table.bulkAdd()](/docs/Table/Table.bulkAdd()) with invalid arguments.
* calling [Table.update()](/docs/Table/Table.update()) with invalid arguments.

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch('InvalidArgumentError', e => {
    // Failed with InvalidArgumentError
    console.error ("InvalidArgument error: " + e.message);
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
        // errnames.InvalidArgument ==="InvalidArgumentError"
        case Dexie.errnames.InvalidArgument:
            console.error ("InvalidArgument error");
            break;
        default:
            console.error ("error: " + e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.InvalidArgument === "InvalidArgumentError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
