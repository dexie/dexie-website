---
layout: docs
title: 'Table.defineClass()'
---

Define a javascript constructor that will be mapped to this object store.

### Syntax

```javascript
table.defineClass(structure)
```

### Parameters

<table>
<tr><td>structure: Object</td><td>Definition of the properties available on instances of the class and their types.</td></tr>
</table>

### Return Value

Constructor function for the defined class.

### Remarks

Makes any object extracted from this table be instanceof a class with given structure. You could extend the prototype of the returned constructor function with methods that will be available on all objects returned by the database.

If calling this method before db.open() call, intelligent javascript editors like Visual Studio 2012+ and IntelliJ will be able to do autocomplete for all objects returned by the database, based on the prototype of the constructor and on given structure.

### Sample

```javascript
var db = new Dexie("FriendsDB");

// The stores() method just specify primary key and indexes
db.version(1).stores({
    friends: "++id,name,shoeSize"
});

// When using defineClass(), you may specify
// non-indexed properties as well and their types
var Friend = db.friends.defineClass ({
    name: String,
    shoeSize: Number,
    cars: [Car],
    address: {
        street: String,
        city: String,
        country: String
    }        
});

function Car() {}

Friend.prototype.log = function () {
    console.log(JSON.stringify(this));
}

db.open();

db.friends.where("name").startsWithIgnoreCase("d").each(function(friend) {
    friend.log();
}).catch(function (e) {
    console.error(e);
});
```

### See Also

[Table.mapToClass()](/docs/Table/Table.mapToClass())
