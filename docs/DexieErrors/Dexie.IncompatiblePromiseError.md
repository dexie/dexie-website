---
layout: docs
title: 'Dexie.IncompatiblePromiseError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.IncompatiblePromiseError

### Description 

*Obsolete since Dexie 2.0.0*

**This error is removed in Dexie v2.x because from that version and forward, native promises are accepted to return from a transaction scope.**

Happens only in Dexie v1.x when returning an incompatible Promise from a transaction scope. You need to verify that you are only using Dexie.Promises for all async code withing any transaction scope.

