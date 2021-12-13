---
layout: docs
title: "Table.hook('updating')"
---

*NOTE: Since Dexie 3.0, there is a new API superior to this hooks API: [DBCore](/docs/DBCore/DBCore). There is NO PLAN for deprecation of this hooks API though, but it in future, we may extract this API to an addon.*

### Syntax

```javascript
db.[tableName].hook('updating', function (modifications, primKey, obj, transaction) {
    // You may use transaction to do additional database operations.
    // You may not do any modifications on any of the given arguments.
    // You may set this.onsuccess = function (updatedObj){} when update operation completes.
    // You may set this.onerror = callback if update operation fails.
    // If you want to make additional modifications,
    // return another modifications object
    // containing the additional or overridden modifications to make. Any returned
    // object will be merged to the given modifications object.
});
```

### Parameters
<table>
<tr><td>modifications</td><td>An <i>Object</i> where property names are the key-paths to the properties being modified and values are the new values being set. Deletions of properties are represented by a value of <i>undefined</i>, i.e. modifications.hasOwnProperty(propName) will be true, but the value will be <i>undefined</i>. You must not make changes to this object. Instead, you can return a new modifications object containing the additional modifications you want to apply.</td></tr>
<tr><td>primKey</td><td>The primary key of the object being updated</td></tr>
<tr><td>obj</td><td>Object that is about to be updated. This object must not be modified. Instead return a new modification object containing additional or replaced modifications to make.</td></tr>
<tr><td>transaction</td><td><a href="/docs/Transaction/Transaction">Transaction</a> instance.</td></tr>
<tr><td>&lt;<i>this</i> context&gt;</td><td>Possibility to be notified when the update operation succeeds or fails. Done by setting this.onsuccess = function(){} or this.onerror = function(){}</td></tr>
</table>

### Return Value

If you do not want to change any modification, dont return any value (return undefined). If you want to add additional modifications or change any of the modifications in the given _modifications_ argument, you should return another object containing the additional or overridden modifications to make.

### To Unsubscribe

```javascript
db.[tableName].hook('updating').unsubscribe(yourListenerFunction)
```

### Description

This event is called whenever an existing database object is about to be updated (through any of the following methods: [put()](/docs/Table/Table.put()), [update()](/docs/Table/Table.update()) or [modify()](/docs/Collection/Collection.modify()). Calling [put()](/docs/Table/Table.put()) will only result in an <i>updating</i> event in case it results in replacing an existing object, otherwise, if [put()](/docs/Table/Table.put()) results in an object creation, the _creating_ event will be triggered

A subscriber may use the given `transaction` object to do additional operations on the database. The chain of operations can be considered atomic since the subscriber can work on the same transaction as being used for updating the object. If any exception or database error event occur, the entire transaction will abort.

If it is desired to make additional modifications, the subscriber may return its own modifications object containing any additional modifications to make.

If it is desired to know whether the modification will succeed or not, use `this.onsuccess = function(updatedObj){}` or `this.onerror = function(error){}` to be called _after_ the object has been updated. NOTE: Transaction may still be aborted after the onsuccess callback has been called. To execute code after successful update and transaction commit, you may use transaction.on('complete', ...).

### Error Handling

If subscriber throws an exception, the update operation will fail and the caller of the update operation will get the failure as a Promise rejection that may be catched/handled or not. If the caller of the update operation does not catch the excetion using Promise.catch(), the transaction will be aborted.

If a database operation initiated by the subscriber, results in a failure, the transaction will be aborted no matter if the origin caller of the update operation calls catch() or not. However, the origin caller will receive your error if catching transaction failures, but then the transaction has already aborted. If you as the implementor of the subscriber want to ignore errors resulting from your operations, you may catch() your database operations to prohibit transaction from being aborted. However, it is normally better to let the transaction abort in case a failure of your database operation would impinge database consistency.

If setting this.onsuccess or this.onerror, those callback functions are responsible of not throwing any exception. Any code within that callback must either be bullet proof or surrounded by try/catch.

### Use Cases of the CRUD events

Dexie CRUD events can be used to implement several addons to Dexie such as:
* Server Synchronization
* Automatic primary key generation
* Full-text search or other custom ways of indexing properties
* Manipulation of returned objects

The add-ons [Dexie.Observable.js](/docs/Observable/Dexie.Observable.js) and [Dexie.Syncable.js](/docs/Syncable/Dexie.Syncable.js) uses  `hook('creating')`, `hook('updating')` and `hook('deleting')` to make the database locally observable as well as syncable with a remote server.

The `hook('reading')` is used internally by Dexie.js by the methods [Table.defineClass()](/docs/Table/Table.defineClass()) and [Table.mapToClass()](/docs/Table/Table.mapToClass()) in order to make all objects retrieved from database inherit a given class using prototypal inheritance.

### Sample: Full-text search

This example is a simple implementation of full-text search index based on multi-valued indexes and Dexie hooks.

```javascript
var db = new Dexie("FullTextSample");

db.version(1).stores(
  {emails: "++id,subject,from,*to,*cc,*bcc,message,*messageWords"}
);

// Add hooks that will index "message" for full-text search:
db.emails.hook("creating", function (primKey, obj, trans) {
  if (typeof obj.message == 'string') obj.messageWords = getAllWords(obj.message);
});
db.emails.hook("updating", function (mods, primKey, obj, trans) {
  if (mods.hasOwnProperty("message")) {
    // "message" property is being updated
    if (typeof mods.message == 'string')
      // "message" property was updated to another valid value.
      // Re-index messageWords:
      return { messageWords: getAllWords(mods.message) };
    else
      // "message" property was deleted (typeof mods.message === 'undefined')
      // or changed to an unknown type. Remove indexes:
      return { messageWords: [] };
  }
});

function getAllWords(text) {
  /// <param name="text" type="String"></param>
  var allWordsIncludingDups = text.split(' ');
  var wordSet = allWordsIncludingDups.reduce(function (prev, current) {
      prev[current] = true;
      return prev;
  }, {});
  return Object.keys(set);
}

// Open database to allow application code using it.
db.open();

//
// Application code:
//

db.transaction('rw', db.emails, function () {
  // Add an email:
  db.emails.add({
    subject: "Testing full-text search",
    from: "david@abc.com",
    to: ["test@abc.com"],
    message: "Here is my very long message that I want to write"
  });

  // Search for emails:
  db.emails.where("messageWords")
    .startsWithIgnoreCase("v")
    .distinct()
    .toArray(function (a) {
      alert("Found " + a.length + " emails containing a word starting with 'v'");
    });
}).catch(function (e) {
  alert(e.stack || e);
});
```

NOTE: Multi-valued indexes are only supported in Opera, Firefox and Chrome. Does not work with IE so far.
However, it is also possible to implement it using custom views, which is implemented in FullTextSearch2.js.

#### Sample Source Locations
* [FullTextSearch.js](https://github.com/dexie/Dexie.js/blob/master/samples/full-text-search/FullTextSearch.js) (using multi-valued indexes)
* [FullTextSearch2.js](https://github.com/dexie/Dexie.js/blob/master/samples/full-text-search/FullTextSearch2.js) (using custom views)

### See Also

[Table.hook('creating')](/docs/Table/Table.hook('creating'))

[Table.hook('reading')](/docs/Table/Table.hook('reading'))

[Table.hook('deleting')](/docs/Table/Table.hook('deleting'))

[Dexie.Observable.js](/docs/Observable/Dexie.Observable.js)
