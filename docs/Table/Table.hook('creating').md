---
layout: docs
title: "Table.hook('creating')"
---

*NOTE: Since Dexie 3.0, there is a new API superior to this hooks API: [DBCore](/docs/DBCore/DBCore). There is NO PLAN for deprecation of this hooks API though, but it in future, we may extract this API to an addon.*

### Syntax

```javascript
db.[tableName].hook('creating', function (primKey, obj, transaction) {
    // You may do additional database operations using given transaction object.
    // You may also modify given obj
    // You may set this.onsuccess = function (primKey){}. Called when autoincremented key is known.
    // You may set this.onerror = callback if create operation fails.
    // If returning any value other than undefined, the returned value will be used as primary key
});
```

### Parameters
<table>
  <tr>
    <td>primKey</td>
    <td>The primary key of the object being added, or undefined in case primary key will be created by the system.</td>
  </tr>
  <tr>
    <td>obj</td>
    <td>Object that is about to be created. Modification of obj will affect what will be added to the database.</td>
  </tr>
  <tr>
    <td>transaction</td>
    <td><a href="/docs/Transaction/Transaction">Transaction</a> instance.</td>
  </tr>
  <tr>
    <td>&lt;<i>this</i> context&gt;</td>
    <td>Possibility to be notified when the create operation succeeds or fails. Done by setting this.onsuccess = function(){} or this.onerror = function(){}</td>
  </tr>
</table>

### Return Value

If return value of given subscriber is other than `undefined`, the return value will be used as the primary key. Implementors may use this to provide extended methods of auto-generation primary keys other than the built-in autoIncrement (++) method. Return value is only handled in case given primKey was undefined. If primKey was set, any return value will be ignored since it is not allowed.

### To Unsubscribe

```javascript
db.[tableName].hook('creating').unsubscribe(yourListenerFunction)
```
*yourListenerFunction* refers to the same function instance that you have passed to Table.hook('creating'). If you will need to unsubscribe, you can't inline that function as we do in the main sample. Instead keep a reference to it in a closure or on a class property.

```javascript
function listenerFunction (primKey, obj, transaction) {
  // Do your stuff...
}

// Subscribe:
db.[tableName].hook('creating', listenerFunction);

// Unsubscribe:
db.[tableName].hook('creating').unsubscribe(listenerFunction);
```



### Description

This event is called whenever an object is being added into the database no matter which method is used. When calling [Table.add()](/docs/Table/Table.add()), it will always be called. But when calling [Table.put()](/docs/Table/Table.put()) it will only be called if the operation results in an object creation. If it would result in replacing an existing object, hook('updating') will be triggered.

A subscriber may use the given `transaction` object to do additional operations on the database. The chain of operations can be considered atomic since the subscriber can work on the same transaction as being used for creating the object. If any exception or database error event occur, the entire transaction will abort.

### Error Handling

If subscriber throws an exception, the create operation will fail and the caller of the create operation will get the failure as a Promise rejection that may be caught/handled or not. If the caller of the create operation does not catch the exception using Promise.catch(), the transaction will be aborted.

If a database operation initiated by the subscriber, results in a failure, the transaction will be aborted no matter if the origin caller of the create operation calls catch() or not. However, the origin caller will receive your error if catching transaction failures, but then the transaction has already aborted. If you as the implementer of the subscriber want to ignore errors resulting from your operations, you may catch() your database operations to prohibit transaction from being aborted. However, it is normally better to let the transaction abort in case a failure of your database operation would impinge database consistency.

If setting `this.onsuccess` or `this.onerror`, those callback functions are responsible for not throwing any exception. Any code within that callback must either be bullet proof or surrounded by try/catch.

### Use Cases of the CRUD events

Dexie CRUD events can be used to implement several addons to Dexie such as:
* Server Synchronization
* Automatic primary key generation
* Full-text search or other custom ways of indexing properties
* Manipulation of returned objects

The add-ons [Dexie.Observable.js](/docs/Observable/Dexie.Observable.js) and [Dexie.Syncable.js](/docs/Syncable/Dexie.Syncable.js) uses `hook('creating')`, `hook('updating')` and `hook('deleting')` to make the database locally observable as well as syncable with a remote server.

The `hook('reading')` is used internally by Dexie.js by the methods [Table.defineClass()](/docs/Table/Table.defineClass()) and [Table.mapToClass()](/docs/Table/Table.mapToClass()) in order to make all objects retrieved from database inherit a given class using prototypal inheritance.

### Sample: Full-text search

This example is a simple implementation of full-text search index based on multi-valued indexes and Dexie hooks.

```javascript
var db = new Dexie("FullTextSample");

db.version(1).stores({
  emails: "++id,subject,from,*to,*cc,*bcc,message,*messageWords"
});

// Add hooks that will index "message" for full-text search:
db.emails.hook("creating", function (primKey, obj, trans) {
    if (typeof obj.message == 'string') obj.messageWords = getAllWords(obj.message);
});

db.emails.hook("updating", function (mods, primKey, obj, trans) {
  if (mods.hasOwnProperty("message")) {
    // "message" property is being updated
    if (typeof mods.message == 'string') {
        // "message" property was updated to another valid value.
        // Re-index messageWords:
        return { messageWords: getAllWords(mods.message) };
    } else {
        // "message" property was deleted (typeof mods.message === 'undefined') or
        // changed to an unknown type. Remove indexes:
        return { messageWords: [] };
    }
  }
});

function getAllWords(text) {
  /// <param name="text" type="String"></param>
  var allWordsIncludingDups = text.split(' ');
  var wordSet = allWordsIncludingDups.reduce(function (prev, current) {
      prev[current] = true;
      return prev;
  }, {});
  return Object.keys(wordSet);
}

// Open database to allow application code using it.
db.open();

//
// Application code
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

Sample Source Locations:
* [FullTextSearch.js](https://github.com/dexie/Dexie.js/blob/master/samples/full-text-search/FullTextSearch.js) (using multi-valued indexes)
* [FullTextSearch2.js](https://github.com/dexie/Dexie.js/blob/master/samples/full-text-search/FullTextSearch2.js) (using custom views)

### See Also

[Table.hook('reading')](/docs/Table/Table.hook('reading'))

[Table.hook('updating')](/docs/Table/Table.hook('updating'))

[Table.hook('deleting')](/docs/Table/Table.hook('deleting'))

[Dexie.Observable.js](/docs/Observable/Dexie.Observable.js)

