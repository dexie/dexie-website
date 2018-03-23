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

<table>
  <tr><td></td><td>Using function*() and yield</td><td>Using async / await</td></tr>
  <tr><td>Declare async function</td><td>Dexie.async(function* () {});</td><td>async function() {}</td></tr>
  <tr><td>Declare+execute function</td><td>Dexie.spawn(function* () {});</td><td>(async function() {})()</td></tr>
  <tr><td>Await a Promise</td><td>yield p;</td><td>await p;</td></tr>
  <tr><td>Declare Promise Generator</td><td>function* f (){}</td><td>N/A</td></tr>
  <tr><td>Await Promise Generator</td><td>yield* fn();</td><td>N/A</td></tr>
</table>

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

[Dexie.spawn()](/docs/Dexie/Dexie.spawn())
