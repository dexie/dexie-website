---
layout: docs
title: 'IndexedDB on Safari'
---

## Safari versions below 8

* No support for indexedDB
* There's a shim that builds indexedDB support on top of WebSQL: [IndexedDBShim](https://github.com/axemclion/IndexedDBShim).

## Safari version 8.x

* Native support for indexedDB but has lots of [issues](http://www.raymondcamden.com/2014/09/25/IndexedDB-on-iOS-8-Broken-Bad):
  1. Transactions can only target a single object store at a time.
  2. Primary keys must be unique **across** different objects stores.
  3. Compound indexes or primary keys are not supported.
  4. [MultiEntry](/docs/MultiEntry-Index) indexes not supported.

## Safari version >= 10.1 and 11.0

Native and almost bug free support for IndexedDB 2.0. There is still [one known issue](https://bugs.webkit.org/show_bug.cgi?id=178380) with version 10 and 11 that affects Dexie's [Collection.modify()](/docs/Collection/Collection.modify()) in Dexie versions <= 2.0. A new workaround for this Safari issue will likely to be included in Dexie version > 2.0. The progress of this can be followed up in [issue #594](https://github.com/dfahlander/Dexie.js/issues/594).

## Chrome and Opera on IOS

Thanks to Apples restricted policies for iOS, Chrome and Opera running on iOS is actually a Safari browser in the backend pretending to be Chrome or Opera. Thus, it suffers from all the indexedDB bugginess that comes with the native indexedDB support in Safari. See Issue [#110](https://github.com/dfahlander/Dexie.js/issues/110).

If your application must target iPhone 6 or below, it is recommended to include the indexedDB shim before requiring/including Dexie.js. iPhone 7 users will have a Safari engine of version >= 10.3 with a functional IndexedDB support.
