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

Native and better support for IndexedDB 2.0. Dexie users are though still struggeling with both stability- and compliance issues in Safari 10.1 and Safari 11, see issue list below.

* [Database opening hangs in Safari 10.1](https://github.com/dfahlander/Dexie.js/issues/508). [Reported to bugs.webkit.org](https://bugs.webkit.org/show_bug.cgi?id=171049)
* [Crash when using with fastClickjs](https://github.com/dfahlander/Dexie.js/issues/559)
* Solved: [Crash issue with getAll() on Safari 10.1](https://github.com/dfahlander/Dexie.js/issues/565). Worked around in Dexie and solved in Safari 11.
* [Can't add File to database](https://github.com/dfahlander/Dexie.js/issues/577)
* [Safari and CryptoKeys](https://github.com/dfahlander/Dexie.js/issues/585)
* MAJOR: [Safari + where + modify = only one updated](https://github.com/dfahlander/Dexie.js/issues/594) 
* [Safari Upgrade issue: Can't create Dexie database in Safari 11.0.1 (11604.3.5.1.1)](https://github.com/dfahlander/Dexie.js/issues/616)
* [Safari 11 add blob becomes null](https://github.com/dfahlander/Dexie.js/issues/618)
* MAJOR: [Safari save Uint8Array in DB](https://github.com/dfahlander/Dexie.js/issues/656)
* [Chrashed Page on Safari](https://github.com/dfahlander/Dexie.js/issues/668)

## Chrome and Opera on IOS

Thanks to Apples restricted policies for iOS, Chrome and Opera running on iOS is actually a Safari browser in the backend pretending to be Chrome or Opera. Thus, it suffers from all the indexedDB bugginess that comes with the native indexedDB support in Safari. See Issue [#110](https://github.com/dfahlander/Dexie.js/issues/110).

If your application must target iPhone 6 or below, it is recommended to include the indexedDB shim before requiring/including Dexie.js. iPhone 7 users will have a Safari engine of version >= 10.3 with a functional IndexedDB support.
