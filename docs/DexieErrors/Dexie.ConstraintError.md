---
layout: docs
title: 'Dexie.ConstraintError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.ConstraintError

### Description 

A database operation was attempted that violates a constraint. For example, if you've defined a unique index "name" and put two objects in that table with the same name, the second put() will result in a constraint error

```javascript
const db = new Dexie('mydb');
db.version(1).stores({
    foo: "id, &name"
});

async function main () {
    try {
        await db.foo.put({id: 1, name: "foo"}); // ok
        await db.foo.put({id: 2, name: "bar"}); // ok
        await db.foo.put({id: 3, name: "bar"}); // will fail with ConstraintError
    } catch (e) {
        assert (e.name === "ConstraintError");
    }
}

main();

```

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch('ConstraintError', e => {
    // Failed with ConstraintError
    console.error ("Constraint error: " + e.message);
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
        // errnames.Constraint ==="ConstraintError"
        case Dexie.errnames.Constraint:
            console.error ("Constraint error");
            break;
        default:
            console.error ("error: " + e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.Constraint === "ConstraintError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
