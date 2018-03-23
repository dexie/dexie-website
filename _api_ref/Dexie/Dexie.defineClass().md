---
layout: docs
title: 'Dexie.defineClass()'
---

### Syntax

```javascript
var Class = Dexie.defineClass(structure);
```

### Sample

```javascript
var Friend = Dexie.defineClass({
    name: String,
    shoeSize: Number
});

Friend.prototype.sayHi = function () {
    alert ("Hi, my name is " + this.name);
}

var db = new Dexie("FriendsDB");
db.version(1).stores({friends: "++id,name"});
db.friends.mapToClass (Friend);
```

### See Also

[Table.defineClass()](/docs/Table/Table.defineClass())

[Table.mapToClass()](/docs/Table/Table.mapToClass())
