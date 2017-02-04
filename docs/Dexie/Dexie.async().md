---
layout: docs
title: 'Dexie.async()'
---

### Syntax

```javascript
var myAsyncFunction = Dexie.async(function* () {
    // Function body goes here.
    // To await, use the yield keyword.
});
```

### Return Value

Function

### Description

Makes it possible to use async functions with modern browsers (Chrome, Firefox, Opera and Edge) without the need of a transpiler.

Table below shows how this maps to ES7 async / await.
```
                         +--------------------------------+--------------------------+
                         | Using function*() and yield    | Using async / await      |
                         +--------------------------------+--------------------------+
Declare async function   | Dexie.async(function* () {});  | async function() {}      |
                         +--------------------------------+--------------------------+
Declare+execute function | Dexie.spawn(function* () {});  | (async function() {})()  |
                         +--------------------------------+--------------------------+
Await a Promise          | yield p;                       | await p;                 |
                         +--------------------------------+--------------------------+
Declare Promise Generator| function* f (){}               | N/A                      |
                         +-----------------------------------------------------------+
Await Promise Generator  | yield* f();                    | N/A                      |
                         +-----------------------------------------------------------+

```

### Sample

```javascript
var myAsyncFunction = Dexie.async(function* () {
    var db = new Dexie("TestDB");
    db.version(1).stores({foo: ',bar'});
    try {
        yield Dexie.delete("TestDB");
        yield db.open();
        yield db.foo.add({bar: "foobar"}, 1);
        var items = yield db.foo.toArray();
        console.log(items.length);
    } finally {
        db.close();
    }
});

myAsyncFunction().catch(e => console.error(e));

```

### See Also
[Dexie.spawn()](Dexie.spawn())
