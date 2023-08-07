---
layout: docs
title: 'Transaction'
---

Represents a database transaction.

### Construction

Transactions are created in the following methods and events: 

* [Dexie.transaction()](/docs/Dexie/Dexie.transaction())
* [Dexie.on.populate](/docs/Dexie/Dexie.on.populate)
* [Version.upgrade()](/docs/Version/Version.upgrade())

The currently executing transaction is retrieved from [Dexie.currentTransaction](/docs/Dexie/Dexie.currentTransaction) property.

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
*Deprecated. See [Deprecations](/docs/Deprecations)*
Map between table names and [Table](/docs/Table/Table) instances

#### storeNames : Array<String>
Array of object store names that the Transaction can access. The list depends on which tables were given to [Dexie.transaction()](/docs/Dexie/Dexie.transaction()) when starting the transaction. For upgrade transactions, all object stores will be present in this list.

#### scopeFunc : Function (optional)
The callback function passed to db.transaction(). For Transactions that has been implicitly created (Not created via db.transaction()), this property will not be set.

### Events

#### [Transaction.on('complete')](/docs/Transaction/Transaction.on.complete)

#### [Transaction.on('abort')](/docs/Transaction/Transaction.on.abort)

#### [Transaction.on('error')](/docs/Transaction/Transaction.on.error)

### Methods

#### [abort()](/docs/Transaction/Transaction.abort())
Abort the transaction.

#### [table()](/docs/Transaction/Transaction.table())
Get a transaction-bound [Table](/docs/Table/Table) instance representing one of your object stores specified in [Version.stores()](/docs/Version/Version.stores()).

### See Also

#### [Dexie.transaction()](/docs/Dexie/Dexie.transaction())
Create Transaction and enter transaction scope.

#### [Dexie.on.populate](/docs/Dexie/Dexie.on.populate)
Initialize Database where a transaction in an Upgrade state is given to subscriber.

#### [Version.upgrade()](/docs/Version/Version.upgrade())
Upgrade Database where a transaction in an Upgrade state is given to subscriber.
