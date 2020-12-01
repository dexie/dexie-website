---
layout: docs
title: 'Dexie.MissingAPIError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.MissingAPIError

### Description 

Happens when indexedDB API could not be found when trying to open database. This is usually the case when using Dexie from node without indexedDB or IDBKeyRange present on the global object.

In a modern browser or worker, window.indexedDB or self.indexedDB is present by default so you don't have to do anything. But if you use Dexie from a node process you will need to provide an indexedDB implementation. For nodejs, you can use fakeIndexedDB or indexedDBShim.

* [Using Dexie with fakeIndexedDB](https://github.com/dumbmatter/fakeIndexedDB#with-dexie-and-other-indexeddb-api-wrappers)
* [Using Dexie with IndexedDBShim](https://github.com/indexeddbshim/IndexedDBShim#node-set-up)
* [Using Dexie in an electron app](https://gauriatiq.medium.com/electron-app-database-with-dexie-js-indexeddb-and-web-worker-570d9a66a47a)

