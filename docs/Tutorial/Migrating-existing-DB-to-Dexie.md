---
layout: docs
title: 'Migrating existing DB to Dexie'
---

Dexie can open any indexedDB database, no matter if you've created it via raw indexedDB or another indexedDB wrapper.

# How to migrate

1. Publish [this HTML page](https://github.com/dfahlander/Dexie.js/blob/master/samples/open-existing-db/dump-databases.html) somewhere in the same origin as your app resides in (such as http://locahost:8080/dump-databases.html).
2. Use Chrome or Opera to navigate to your existing app (to ensure it will create the database your way). Then just navigate to the dump-database.html page and copy the generated code from the output and use it in your app.

That's all. After that, you may even use Dexie and your own raw indexedDB code / other wrapper in parallell if you like.

*NOTE: Dexie will use the version number divided by 10. Nothing to be afraid of. It just is like that. [Here's an explanation](https://github.com/dfahlander/Dexie.js/issues/59).*

# What you will see

A log window will display your existing database schema in Dexie format. Copy and paste that into your app code to get up running with Dexie. It will show something like the following:

```
Dumping Databases
=================
var db = new Dexie('tasks');
db.version(0.2).stores({
    tasks: 'id,description,date,done',
    notes: '++id,taskId,note'
});

Finished dumping databases
==========================
```

Just copy that code into your app and start querying your existing data with Dexie.

# Demigration

You can always go back to not using Dexie if you later on decides so, or you could run parts of the code through Dexie and parts through the raw indexedDB API.

If demigrating, just be aware of the [version multiplied by 10](https://github.com/dfahlander/Dexie.js/issues/59) thingie. If you're on version(2) in Dexie, your raw database would be on version 20. That shouldn't be a problem as long as you're aware of it.

Happy migration!

#### [Back to tutorial](/docs/Tutorial)
