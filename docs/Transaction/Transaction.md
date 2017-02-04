---
layout: docs
title: 'Transaction'
---
Represents a database transaction.

### Construction

Transactions are created in the following methods and events: 

* [Dexie.transaction()](Dexie.transaction())
* [Dexie.on.populate](Dexie.on.populate)
* [Version.upgrade()](Version.upgrade())

The currently executing transaction is retrieved from [Dexie.currentTransaction](Dexie.currentTransaction) property.

### Properties

#### active : Boolean
True until transaction is committed or aborted.

#### db : Dexie
The Dexie instance that created the transaction.

#### mode : String
"readonly" or "readwrite"

#### idbtrans : [IDBTransaction](https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction)
Backend transaction instance

#### tables : Object
*Deprecated. See [Deprecations](Deprecations)*
Map between table names and [Table](Table) instances

#### storeNames : Array<String>
Array of object store names that the Transaction can access. The list depends on which tables were given to [Dexie.transaction()](Dexie.transaction()) when starting the transaction. For upgrade transactions, all object stores will be present in this list.

#### scopeFunc : Function (optional)
The callback function passed to db.transaction(). For Transactions that has been implicitely created (Not created via db.transaction()), this property will not be set.

### Events

#### [Transaction.on('complete')](Transaction.on.complete)

#### [Transaction.on('abort')](Transaction.on.abort)

#### [Transaction.on('error')](Transaction.on.error)

### Methods

#### [abort()](Transaction.abort())
Abort the transaction.

#### [table()](Transaction.table())
Get a transaction-bound [Table](Table) instance representing one of your object stores specified in [Version.stores()](Version.stores()).

### See Also

#### [Dexie.transaction()](Dexie.transaction())
Create Transaction and enter transaction scope.

#### [Dexie.on.populate](Dexie.on.populate)
Initialize Database where a transaction in an Upgrade state is given to subscriber.

#### [Version.upgrade()](Version.upgrade())
Upgrade Database where a transaction in an Upgrade state is given to subscriber.
