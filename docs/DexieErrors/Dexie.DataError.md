---
layout: docs
title: 'Dexie.DataError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.DataError

### Description 

An index property (or primary key) was of the wrong type (not an [indexable](/docs/Indexable-Type)). This happens when:

* ...adding a new object to a table where its primary key is not an [indexable type](/docs/Indexable-Type))
* ...querying by index, where the argument is not an [indexable type](/docs/Indexable-Type))

## Sample

```javascript

const db = new Dexie('testdb');
db.version(1).stores({
    foo: 'id,bar'
});

db.foo.put({id: null}); // fails with DataError because null is not indexable.
db.foo.put({id: 1, bar: null}); // succeeds but won't generate any "bar" index.
db.foo.where('bar').equals(undefined).toArray(); // Fails with DataError since undefined is not indexable.

```

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch('DataError', e => {
    // Failed with DataError
    console.error ("Data error: " + e.message);
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
        // errnames.Data ==="DataError"
        case Dexie.errnames.Data:
            console.error ("Data error");
            break;
        default:
            console.error ("error: " + e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.Data === "DataError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
