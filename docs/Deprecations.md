---
layout: docs
title: 'Deprecations'
---
This page contains all historical deprecations and breaking changes for Dexie.js.

<br>
# Breaking Changes in Dexie 3.0
<hr>


## [Transaction.tables](/docs/Transaction/Transaction#tables--object)
Deprecated since v1.5.0

Obsolete in: v3.0.0

Reason: Transaction-bound tables are created runtime using trans.table(tableName) or property getters for trans[tableName]. The Transaction constructor will no longer create those instances in advance. This is to optimize the Transaction constructor. Because of that, we cannot provide a tables property containing eagerly instanciated Table instances.

Workaround: See code snipped below:

```javascript
trans.storeNames.map(name => trans.table(name));
```

Note: The workaround returns Array<Table> whilst Transaction.tables property contained a map between
table names and instances.

<br>
# Breaking Changes in Dexie 2.0
<hr>

## [Dexie.on.error / db.on('error')](/docs/Dexie/Dexie.on.error)

Deprecated since v1.5.0

Obsolete since: v2.0.0

Reason: This event gave the false impression that it would trigger on any error, but ordinary errors such as application exceptions would slip away unless they happened within a transaction. It is always better to subscribe to ['unhandledrejection'](/docs/Promise/unhandledrejection-event) so that not any promise of any kind can slip away unnoticed.

Workaround: Subscribe to the [unhandledrejection event](/docs/Promise/unhandledrejection-event) instead. This is the standard way of catching unhandled native promise rejections as well.

## [Promise.on.error](/docs/Promise/Promise.on.error)
Deprecated since v1.5.0

Obsolete since: v2.0.0

Reason: There is now a standardized event for this, called 'unhandledrejection', see [https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection). From Dexie v1.5.0 and forth, use `window.addEventListener('unhandledrejection', callback)` instead.

Workaround: Subscribe to the [unhandledrejection event](/docs/Promise/unhandledrejection-event) instead. This is the standard way of catching unhandled native promise rejections as well.

## Transaction.error (callback)
Deprecated since v1.5.0

Obsolete since: v2.0.0

Reason: It's just a rarely used sugar for trans.on('error', callback). Was never documented on wiki and has never been used in any sample or unit test.

Workaround: Use [trans.on('error', callback)](/docs/Transaction/Transaction.on.error)

## Transaction.complete (callback)
Deprecated since Dexie v1.5

Obsolete since: v2.0.0

Reason: It's just a rarely used sugar for trans.on('complete', callback). Was never documented on wiki and has never been used in any sample or unit test.

Workaround: Use [trans.on('complete', callback)](/docs/Transaction/Transaction.on.complete)

## WriteableTable and WriteableCollection

Obsolete since: v2.0.0

Reason: Part of general diet of the dexie code base. There's no point of separating Writeable- from non-Writeable Tables and Collections. Rationale: If you're in a readonly transaction and access a method like put(), add() etcs, it is better you get a rejected Promise than just a runtime error about the non-exitance of that method.

Workaround: For normal apps, this has no complications at all, but if you're writing an addon that extends WriteableTable or WriteableCollection, you'll need to change that to extend Table and Collection instead. This will work on older Dexie's as well.

## Automatic use of IndexedDBShim

Obsolete since: v2.0.0-beta.11

Reason: According to best-practices of IndexedDBShim, it should auto-invoke by itself and Dexie should only rely on the shim to do its job. This change is to the better, as the shim won't be used anymore when not needed. However, if you used to include the shim unconditionally before including Dexie, the shim was previously picked up on all browsers that supported WebSQL even though they also supported the full IndexedDB spec. The effect can be that user's data was stored in WebSQL before Dexie 2.0.0-beta.11 so that when beta.11 is used, the DB is empty.

Workaround: If you just want previous behavior, call [shimIndexedDB.__useShim();](https://www.npmjs.com/package/indexeddbshim#shimindexeddb__useshim) before including dexie.


*NOTICE: The deprecation of Transaction.table() and Transaction[table] is taken back (un-deprecated) and will be continously maintained in 2.0.0-beta.5 and forward. There are no plans to ever deprecated them.*
