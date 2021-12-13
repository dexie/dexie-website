---
layout: docs
title: 'Dexie.transaction()-(old-version)'
---

_Since version 0.9.8 a new transaction style was introduced. The API is still backward compatible with the documentation on this page but it is encourage to migrate your code according to the new version of [Dexie.transaction()](/docs/Dexie/Dexie.transaction())_

### Syntax

```javascript
db.transaction(mode, table, [table2], [tableN], ..., callback)
```

### Parameters

<table>
  <tr>
    <td>mode : String</td>
    <td>"r" = readonly or "rw" = readwrite</td>
  </tr>
  <tr>
    <td>table : <a href="/docs/Table/Table">Table</a></td>
    <td>Object store to include in transaction. Pick it from db.[tablename].</td>
  </tr>
  <tr>
    <td>table2 : <a href="/docs/Table/Table">Table</a></td>
    <td> -- " -- </td>
  </tr>
  <tr>
    <td>tableN, ... : <a href="/docs/Table/Table">Table</a></td>
    <td> -- " -- </td>
  </tr>
  <tr>
    <td>callback : Function</td><td>function (table, table2, tableN, ..., transaction) {...}</td>
  </tr>
</table>

### Callback Parameters

<table>
  <tr>
    <td>table : <a href="/docs/Table/Table">Table</a> or <a href="https://github.com/dexie/Dexie.js/wiki/WriteableTable">WriteableTable</a></td>
    <td>
      Transaction-based Table to work on.
      <br/>
      If mode == "r", instance will be <a href="/docs/Table/Table">Table</a>
      <br/>
      If mode == "rw", instance will be <a href="https://github.com/dexie/Dexie.js/wiki/WriteableTable">WriteableTable</a>
    </td>
  </tr>
  <tr>
    <td>table2</td><td> -- " -- </td>
  </tr>
  <tr>
    <td>tableN, ... </td><td> -- " -- </td>
  </tr>
  <tr>
    <td>transaction : <a href="/docs/Transaction/Transaction">Transaction</a></td><td></td>
  </tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Sample

```javascript
var db = new Dexie("FriendsAndPetsDatabase");
db.version(1).stores({
    friends: "++id,name,isCloseFriend",
    pets: "++id,name,kind"
});
db.open(); 
db.transaction("rw", db.friends, db.pets, function(friends, pets, transaction) {
    // Since mode is "rw", we can add objects to the object stores
    friends.add({name: "Måns", isCloseFriend: 1});
    friends.add({name: "Nils", isCloseFriend: 1});
    friends.add({name: "Jon", isCloseFriend: 1});
    pets.add({name: "Josephina", kind: "dog"});

    // In case you need to access the transaction object, here's an example of that:
    transaction.on("abort", function() {
        console.log("Transaction aborted");
    });

    // Since we are in a transaction, we can query the table right away.
    // If this was not in a transaction, we would have to wait for
    // all three add() operations
    // to complete before querying it if we would like to get the latest added data.
    friends.where("isCloseFriend").equals(1).each(function(friend){
        console.log("Found close friend: " + friend.name);
        // Any database error event that occur will abort transaction and
        // be sent to the catch() method below.
        // The exact same rule if any exception is thrown what so ever.
    });
}).catch(function (error) {
    // Log or display the error
    console.error(error.stack || error);
});
```
