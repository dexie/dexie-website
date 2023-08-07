---
layout: docs
title: 'Version.stores()'
---

### Syntax

```javascript
version.stores(schemaDefinition);
```

### Parameters

<table>
<tr><td>schemaDefinition : Object</td><td>Object where each key represents the name of an object store and each value represents the primary and secondary indexes</td></tr>
</table>

### Return Value

[Version](/docs/Version/Version)

### Description 

Specifies tables to be added, altered or deleted in this version. Each key in the schemaDefinition argument represents a table name and each value represents the primary key followed by the list of indexed properties. **NOTE: Unlike SQL, you don't need to specify all properties but only the one you wish to index.**

### WARNING
**Never index properties containing images, movies or large (huge) strings. Store them in IndexedDB, yes! but just don't index them!**

```js
db.version(1).stores({
  friends: '++id, name, age' // don't index "picture"
});

db.friends.put({
  name: 'Camilla',
  age: 25,
  picture: await getBlob('camilla.png') // but store it
});
```
*Example how the "picture" property is stored without being indexed.*

*Writing this because there have been some issues on github where people index images or movies without really understanding the purpose of indexing fields. A rule of thumb: **Are you going to put your property in a where('...') clause? If yes, index it, if not, dont.** Large indexes will affect database performance and in extreme cases make it unstable.*

### Changing the Schema

Please refer to [Database Versioning](/docs/Tutorial/Design#database-versioning) that explains how to add, alter or remove a table using the Versioning framework in Dexie.

### Schema Syntax

<table>
<tr><td>++</td><td>Auto-incremented primary key</td></tr>
<tr><td>&amp;</td><td>Unique index</td></tr>
<tr><td>*</td><td><a href="/docs/MultiEntry-Index">Multi-entry</a> index</td></tr>
<tr><td>[A+B]</td><td><a href="/docs/Compound-Index">Compound index or primary key</a></td></tr>
</table>

*Detail: Primary keys are implicitly marked as unique.*

### Indexable Types
Only properties of [certain types](/docs/Indexable-Type) can be indexed. This includes string, number, Date and Array **but NOT boolean, null or undefined**. Indexing a property path that turns out to hold a non-indexable type will have no effect. And using orderBy() with that property will NOT list that object.

### Detailed Schema Syntax
The first entry in the schema string will always represent the primary key.

<table>
<tr><td colspan="3"><i><b>Syntax For Primary Key</b></i></td></tr>
<tr><td>++keyPath</td><td>Autoincrement primary key</td><td>Means that the primary key will be auto-incremented. Primary key must always be unique.</td></tr>
<tr><td>++</td><td>Hidden autoincremented primary key</td><td>Means that primary key is auto-incremented but not visible on the objects.</td></tr>
<tr><td>keyPath</td><td>Don&apos;t autoincrement primary key</td><td>Means that primary key can be any type and we have to provide it ourself</td></tr>
<tr><td><i>(blank)</i></td><td>Hidden primary key</td><td>Leaving the first entry blank means that primary key is hidden and not auto-incremented</td></tr>
<tr><td colspan="3"><i><b>Syntax For Indexes</b></i></td></tr>
<tr><td>keyPath</td><td></td><td>Means that keyPath is indexed</td></tr>
<tr><td>&amp;keyPath</td><td>Unique</td><td>Means that keyPath is indexed and keys must be unique</td></tr>
<tr><td>*keyPath</td><td>Multi-valued</td><td>Means that if key is an array, each array value will be regarded as a key to the object.</td></tr>
<tr><td>[keyPath1+keyPath2]</td><td>Compound</td><td>Defining a compound index for keyPath1 and keyPath2</td></tr>
</table>

_NOTE: keyPath represents a property name or a dotted path to a nested property._

### Sample

```javascript
var db = new Dexie('MyDatabase');
db.version(1).stores({
    friends: '++id,name,shoeSize', // Primary Key is auto-incremented (++id)
    pets: 'id, name, kind',        // Primary Key is not auto-incremented (id)
    cars: '++, name',              // Primary Key auto-incremented but not inbound
    enemies: ',name,*weaknesses',  // Primary key is neither inbound nor auto-incr
                                   // 'weaknesses' contains an array of keys (*)
    users: 'meta.ssn, addr.city',  // Dotted keypath refers to nested property 
    people: '[name+ssn], &ssn'     // Compound primary key. Unique index ssn
});
```

### Detailed Sample

This sample shows how to define the schema of a given version:

```javascript
var db = new Dexie("FriendsAndPetsDatabase");
db.version(1).stores({
    users: "++id, name, &username, *email, address.city",
    relations: "++, userId1, userId2, [userId1+userId2], relation"
});
db.open().catch(function (e) {
    console.error("Open failed: " + e.stack);
})

db.transaction('rw', db.users, function () {

    db.users.add({
        name: "Zlatan",
        username: "ibra",
        email: [
            "zlatan@ibrahimovic.se",
            "zlatan.ibrahimovic@gmail.com"
        ],
        address: {
            city: "Malmö",
            country: "Sweden"
        }
    });

    db.users.where("email").startsWith("zlatan")
        .or("address.city").anyOf (["Malmö", "Stockholm", "Barcelona"])
        .each(function (user) {
            console.log("Found user: " + user.name);
        });

}).catch (function (e) {
    console.error(e.stack);
});
```

### Detailed Sample Explained

* Table "users" has:
  * an auto-incremented primary key named **id**.
  * an index on the **name** property which could be of any type.
  * a unique index on the **username** property.
  * a _multi_ index on the **email** property, meaning that it allow multiple emails and the possibility to index each of them and find the single user object. _NOTE! This feature lacks support in IE._
  * an index on the nested property 'address.city'.
* Table "relations" doesn't have a "visible" primary key (however, it must have one autoincremented internally).
* Table "relations" has index on the **userId1**, **userId2** and **relation** properties.
* Table "relations" has a compound index of the properties **userId1 and userId2 combined** _NOTE! This feature lacks support in IE._

Queries you could do with these indexes:

* `db.users.get(2)` will give you the user with id 2
* `db.users.where('name').startsWithIgnoreCase('da')` - will give you all users starting with "da"
* `db.users.where('username').equals('usrname').first()` - will give you the user with username 'usrname'
* `db.users.where('email').startsWith('david@').distinct()` - will give you the users that have any of their emails starting with 'david@'
* `db.users.where('address.city').equalsIgnoreCase('malmö')` - will give you all users residing in Malmö.
* `db.relations.where('userId1').equals(2)` - will give you all relations that user with id 2 has to other users
* `db.relations.where('relation').anyOf('wife', 'husband', 'son', 'daughter')` - will give you all family relations.
* `db.relations.where('userId1').equals(2).or('userId2').equals(2)` - will give you all relations that user with id 2 has to other users or other users have to user 2
* `db.relations.where('[userId1+userId2]').equals([2,3])` - will give you all the relations that user 2 has to user 3
* `db.relations.where('[userId1+userId2]').equals([2,3]).or('[userId1+userId2]').equals([3,2])` - will give you all the relations that user 2 has to user 3 or user 3 has to user 2.
