---
layout: docs
title: 'Dexie.on.populate'
---

### Syntax

```ts
db.on("populate", (tx: Transaction) => {
  // Use provided transaction to populate database with initial data
  // tx.table('users').add({id: "me", name: "Me"});
});
```

### Description

The populate event occurs only once in a database' lifetime - in case the database was not present on the client when db.open() was called, and the object stores was needed to be created.

When upgrading database, on("populate") will NOT be called since it was already called before when database was created in the previous version. In case you change the code that subscribes to the populate event between versions, you should add an upgrade function to the new version that upgrades earlier populated data.

The populate event is fired during an onupgradeneeded event and before db.open() has been successfully committed. In case an exception is thrown or an error event happens during the populate event, the entire database creation will be aborted and db.open() will fail.

### Sample

```javascript
var db = new Dexie("MyDB");
db.version(1).stores({friends: "++id, name, gender"});
db.on("populate", function(transaction) {
    transaction.friends.add({name: "Josephina", gender: "unisex"});
});
db.open();
```

### Limitations

The transaction running when the populate event is firing is an upgrade transaction and as all IndexedDB transactions, it will commit as soon as you stop using it. This means that if you call other async APIs, such as ajax calls or setTimeout(), the transaction object will automatically commit and your database will finish opening. When you ajax request as arrives, you are not anymore within the upgrade transaction.

**NOTE: If the callback is an async function, make sure to use the provided transaction rather than the Dexie instance (see above sample). **

If your aim is to populate the database from an ajax- or other asyncronic request, the only bullet-proof way to do that is by using the on('ready') event rather than on('populate'). See a working (and fully tested) sample below:

#### Ajax Populate Sample

This sample shows how to populate your database from an ajax call. Note that on('populate') is not suitable for that and instead we are using on('ready'):

```javascript
var db = new Dexie('someDB');
db.version(1).stores({
    someTable: "++id, someIndex"
});

// Populate from AJAX:
db.on('ready', function (db) {
    // on('ready') event will fire when database is open but 
    // before any other queued operations start executing.
    // By returning a Promise from this event,
    // the framework will wait until promise completes before
    // resuming any queued database operations.
    // Let's start by using the count() method to detect if 
    // database has already been populated.
    return db.someTable.count(function (count) {
        if (count > 0) {
            console.log("Already populated");
        } else {
            console.log("Database is empty. Populating from ajax call...");
            // We want framework to continue waiting, so we encapsulate
            // the ajax call in a Promise that we return here.
            return new Promise(function (resolve, reject) {
                $.ajax(url, {
                    type: 'get',
                    dataType: 'json',
                    error: function (xhr, textStatus) {
                        // Rejecting promise to make db.open() fail.
                        reject(textStatus);
                    },
                    success: function (data) {
                        // Resolving Promise will launch then() below.
                        resolve(data);
                    }
                });
            }).then(function (data) {
                console.log("Got ajax response. We'll now add the objects.");
                // By returning the a promise, framework will keep
                // waiting for this promise to complete before resuming other
                // db-operations.
                console.log("Calling bulkAdd() to insert objects...");
                return db.someTable.bulkAdd(data.someInitArrayOfObjects);
            }).then(function () {
                console.log ("Done populating.");
            });
        }
    });
});

// Following operation will be queued until we're finished populating data:
db.someTable.each(function (obj) {
    // When we come here, data is fully populated and we can log all objects.
    console.log("Found object: " + JSON.stringify(obj));
}).then(function () {
    console.log("Finished.");
}).catch(function (error) {
    // In our each() callback above fails, OR db.open() fails due to any reason,
    // including our ajax call failed, this operation will fail and we will get
    // the error here!
    console.error(error.stack || error);
    // Note that we could also have catched it on db.open() but in this sample,
    // we show it here.
});
```

Console Output on first run:

```
Database is empty. Populating from ajax call...
Got ajax response. We'll now add the objects.
Calling bulkAdd() to insert objects...
Done populating.
Found object: {"someIndex":"item1","id":1}
Found object: {"someIndex":"item2","id":2}
Finished.
```

Console Output when data is already populated:

```
Already populated
Found object: {"someIndex":"item1","id":1}
Found object: {"someIndex":"item2","id":2}
Finished.
```

[Watch the full HTML source](https://github.com/dexie/Dexie.js/blob/master/samples/ajax-populate/populateFromAjaxCall.html), or [view it in your browser](https://raw.githack.com/dexie/Dexie.js/master/samples/ajax-populate/populateFromAjaxCall.html)

### See Also

[The Populate Event](/docs/Tutorial/Design#the-populate-event)
