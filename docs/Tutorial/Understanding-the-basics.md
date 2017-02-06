---
layout: docs
title: 'Understanding the basics'
---

## Creating Database vs opening existing

IndexedDB (and Dexie) has a built-in system for db installation and schema upgrades. This is something that many users have had problems to understand. I get the same questions over and over. People try to do these things manually.

## Best Practice

Your app should have a dedicated module where you create a Dexie instance and specify its version(s) and schema(s). This module should be required where your database is needed.

appdb.js:

```javascript
var db = new Dexie('dbname');
db.version(1).stores({
    friends: 'name, age'
});
db.open().then(function (db) {
    // Database openeded successfully
}).catch (function (err) {
    // Error occurred
});
```

## Understanding the flow

### First time
First time a browser hits the appdb.js code the following happens:

1. Database is being created
2. If [on('populate')](/docs/Dexie/Dexie.on.populate.html) is triggered to populate ground data.
3. db.open() promise resolves.

### Second time

1. Database is just opened and promise resolves.

### Modify Schema

When you need to modify the schema of existing tables, you keep current schema but just add a new version instead.

```javascript
db.version(1).stores({
    friends: 'name, age'
});
db.version(2).stores({
    friends: 'name, age, firstName, lastName',
});
```

### Migrate Data

And if you need to migrate existing data, you add an upgrade function to the new version.

```javascript
db.version(1).stores({
    friends: 'name, age'
});
db.version(2).stores({
    friends: 'name, age, firstName, lastName',
    pets: 'name'
}).upgrade(function () {
    return db.friends.toCollection().modify(function (friend) {
        friend.firstName = friend.name.split(' ')[0];
        friend.lastName = friend.name.split(' ')[1];
    });
});
```

### Changing a few tables only
If you are just adding or changing a few tables, you do not need to repeat the schemas of all the old tables.

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

## Conclusions

* You do never need to check whether the database need to be created. Your code is just declarative.
* Don't edit schemas. Add new versions instead.
* Keep previous versions as long as there are people out there that may have it installed.
* New versions only need to specify the tables that differs from previous version
* To delete a table, add a new version specifying the table as *null*.

*NOTE: In an upcoming Dexie version, you will no longer need to keep old versions unless they have upgraders associated, but for now (as of Dexie 2.0.0-beta.10), this is still the way to do it*

