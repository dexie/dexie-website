---
layout: docs
title: 'Understanding the basics'
---

## Creating Database vs opening existing

IndexedDB (and Dexie) has a built-in system for db installation and schema upgrades. Many people think they will have to check if database needs to be created and run different code depending on whether the database was installed on the client or not. This is not neeeded. Your dexie code can be declarative (you declare what tables and schemas you have in current and previously released versions and you let Dexie / indexedDB handle the situation where a database wasn't created yet, needs upgrade or is already on latest version).

IndexedDB is designed for handling database creation and upgrades through the `onupgradeneeded` event, and define the schema there. There is no native method for checking whether a database exists or not. Dexie adds a declarative schema syntax on top of that so that you don't need to subscribe to the `onupgradeneeded` event either. 

## Declarative Schema 
The database schema is declarative, not imperative. 

```javascript
var db = new Dexie('dbname');
db.version(1).stores({
    friends: 'name, age'
});
db.open().then(function (db) {
    // Database opened successfully
}).catch (function (err) {
    // Error occurred
});
```

## Primary and secondary indexes

When declaring `friends: 'name, age'` the first property implicitly becomes the primary index (also called primary key). The declaration states that we want a table called 'friends' where the property 'name' is the primary key and where we add a secondary index on 'age'. A primary key is unique - you can never tore two objects with the primary key into the same table - for that reason, most examples you will see will use a proprety 'id' or 'key' as primary key instead. You will also see sample using a `++` before the primary index - which makes it auto-incremented. You may also see examples with `&` before a secondary index, making that index unique the same way as primary indexes are implicitly unique without having to specify `&` explicitely.

## Understanding the flow

### First time
First time a browser hits the appdb.js code the following happens:

1. Database is being created
2. If [on('populate')](/docs/Dexie/Dexie.on.populate.html) is triggered to populate ground data.
3. db.open() promise resolves.

### Second time

1. Database is just opened and promise resolves.

### Modify Schema

When you need to modify the schema, also update version number. In the sample below, we remove the "name" index and added two new indexes "firstName", "lastName" of the friends table. We also modify version from 1 to 2 in order for this change to have effect:

```javascript
db.version(2).stores({
    friends: 'firstName, lastName, age'
});
```

In older version of Dexie (version &lt;3.0), you had to also keep all previous version declarations side by side with the new:

```javascript
db.version(1).stores({
    friends: 'name, age'
});
db.version(2).stores({
    friends: 'firstName, lastName, age',
});
```

### Migrate Data

When you need to migrate existing data, you need to keep the old version side by side with the new and attach an upgrade function to the new version.

```javascript
db.version(1).stores({
    friends: 'name, age'
});
db.version(2).stores({
    friends: 'firstName, lastName, age',
}).upgrade(tx => {
    return tx.table("friends").toCollection().modify(friend => {
        const names = friend.name.split(' ');
        friend.firstName = names.shift();
        friend.lastName = names.join(' ');
        delete friend.name;
    });
});
```

### Changing a few tables only
If you are just adding or changing a few tables, you do not need to repeat the schemas of all the old tables if those tables are already present in a kept older version.

```javascript
db.version(2).stores({
    friends: 'name, age, firstName, lastName',
});
db.version(3).stores({
    pets: 'name' // Only need to specify pets, as friends should be same as for version 2.
});
```

### Deleting tables
Since it is not mandatory to repeat old tables, Dexie has to be explicitely informed about table deletion. This is done by specifying *null* as the table schema.

```javascript
db.version(1).stores({
    friends: 'name, age'
});
db.version(2).stores({
    friends: 'name, age, firstName, lastName',
});
db.version(3).stores({
    pets: 'name'
});
db.version(4).stores({
    pets: null // Will delete 'pets' table
});
```

### Changes in Dexie 3.0
Before version 3.0, it was not recommended to modify an existing schema, but instead always add a new version with the new declaration. Since Dexie version 3.0, you only have to do that when an upgrader is attached to the new version. In other cases, you only need to edit schema and modify the version number.

## Conclusions

* You do never need to check whether the database need to be created. Your code is just declarative.
* Whenever editing schema, also remember to update version number.
* Historical versions that have upgraders attached should be kept as long as there are people out there that may have it installed.
* To delete a table, add a new version specifying the table as *null*.
