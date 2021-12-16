---
layout: docs
title: 'Dexie.js'
---

minimalistic and bullet proof indexedDB library.

***

[API Reference](/docs/API-Reference)

[Tutorial](/docs/Tutorial)

[Samples](/docs/Samples)

***

[Forum (google groups)](https://groups.google.com/forum/#!forum/dexiejs)

***

[![Click to download](/assets/images/download-button.png)](Download)

***

#### What is Dexie.js?

Dexie.js is a wrapper library for indexedDB.

#### Why is Dexie.js needed?

Dexie solves these main issues with the native IndexedDB API:

 1. [Ambivalent error handling](/docs/The-Main-Limitations-of-IndexedDB#ambivalent-error-handling)
 2. [Poor queries](/docs/The-Main-Limitations-of-IndexedDB#poor-queries)
 3. [Not reactive](/docs/The-Main-Limitations-of-IndexedDB#not-reactive)
 4. [Code complexity](/docs/The-Main-Limitations-of-IndexedDB#code-complexity)

Dexie.js solves these limitations and provides a neat database API. Dexie.js aims to be the first-hand choice of a IDB Wrapper Library due to its well thought-through API design, robust [error handling](/docs/API-Reference#exception-handling), [extendability](/docs/TutorialBuilding-Addons), [change tracking awareness](/docs/Tutorial/Design#change-tracking) and its extended KeyRange support ([case insensitive search](/docs/WhereClause/WhereClause.equalsIgnoreCase()), [set matches](/docs/WhereClause/WhereClause.anyOf()) and [or operations](/docs/Collection/Collection.or())).

#### Please Show me a Hello World Example

```javascript
//
// Declare Database
//
var db = new Dexie("FriendDatabase");
db.version(1).stores({ friends: "++id,name,age" });
db.open();

//
// Manipulate and Query Database
//
db.friends.add({name: "Josephine", age: 21}).then(function() {
    db.friends.where("age").below(25).each(function(friend) {
        console.log("Found young friend: " + JSON.stringify(friend));
    });
});
```

#### Which browsers support the indexedDB API?

* Firefox
* Chrome
* Edge
* Safari 11+ (actually 8+, but not enough stable before version 11)
* IOS Safari 11+
* IE10+
* Opera 15+
* Android browser (not tested w. Dexie.js yet)
* Blackberry browser (not tested w. Dexie.js yet)
* Opera mobile 16+
* Chrome for Android
* Firefox for Android (not tested w. Dexie.js yet)
* IE Mobile (not tested w. Dexie.js yet)

#### Other competing indexedDB wrappers

* [idb](https://github.com/jakearchibald/idb)
* [db.js](http://aaronpowell.github.io/db.js/)
* [YDN](https://github.com/yathit/ydn-db)
* [IDBWrapper](https://github.com/jensarps/IDBWrapper)
* [Lovefield](https://github.com/google/lovefield)
* [PouchDB](http://pouchdb.com/)
* [RxDB](https://rxdb.info/)

#### Compared to other indexedDB wrappers, what does Dexie.js do different?

* Dexie is not an abstraction layer towards various backends - it's designed around indexedDB.
* You can use your existing IndexedDB data with Dexie.js - no data migration needed.
* Composable real-time queries ([examples in 4 frontend frameworks](https://dexie.org/#live-queries))
* Dexie.js embraces the IndexedDB specification and all its features.
* Robust and well thought-through error handling
* Dexie makes it possible to hook into the actual CREATE/UPDATE/DELETE operation taking place underhood, making it possible to write synchronization extensions on top of indexedDB. This is not even possible out-of-the-box with native indexedDB but Dexie makes it possible by emulating some of the methods using other parts of the API where its needed.
* Dexie.js is the first to support __case insensitive__ search, __set matching__ and logical __OR__ operations using own invented algorithms
* Performance focused - the API only provides query methods that perform well with indexedDB (no iteration of entire tables just to make a query work)
* Minimalistic schema syntax. See [Version.stores()](/docs/Version/Version.stores())
* Automatically upgrades your schema between versions - no need to createIndex() or createObjectStore().
* Dexie can work with "real classes" - you may map a constructor function (class) to an objectStore (table) so that any objects retrieved from DB becomes `instanceof` your class - meaning that you can extend your persisted objects with methods by extending the prototype of your constructor.
* Dexie doesn't hide the backend indexedDB objects from the caller.
* Built with extendability in mind

#### How Dexie differs from the native indexedDB API

1. Dexie uses Promises instead of error events making error handling more convenient to deal with.
2. Dexie can used to [observe IndexedDB](https://dexie.org/#live-queries) and only wake up when the ranges being queried are mutated.
3. Less lines of code are needed to interact with your database
4. Safer Transactions: Dexie will abort a transaction if any exception occur in your transaction closures - not just when a DB error occur. For example, misspelling a variable in the middle of your transaction would normally make the transaction commit automatically. Dexie makes sure this wouldn't happen.
5. By using our own invented algorithms on top of the limited indexedDB API, Dexie supports functionality such as case insensitive search, prefix matching, set matching, logical OR operations and more. See [WhereClause](/docs/WhereClause/WhereClause) and [Collection.or()](/docs/Collection/Collection.or())
6. Dexie can work with "real classes" - you can map a constructor function (class) to an objectStore (table) and let all objects that are returned be real instances of that class. The class may have methods that you can call on objects that are retrieved from the database.
7. Dexie knows whether a put() operation results in object creation or an update. Its CRUD hooks enables you to monitor and gain full control over what is happening in the database. By using the [Dexie.Observable](/docs/Observable/Dexie.Observable) addon you may also subscribe to database changes in foreigh windows - as with the _storage_ event (onstorage) for localStorage.
8. Dexie has a [middleware based architecture](https://dexie.org/docs/Dexie/Dexie.use()) that makes it possible to implement addons, triggers etc.
