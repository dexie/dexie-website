---
layout: docs
title: 'Dexie.defineClass()'
---

### Syntax

    var Class = Dexie.defineClass(structure);

### Sample

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


### See Also

[Table.defineClass()](Table.defineClass())

[Table.mapToClass()](Table.mapToClass())

