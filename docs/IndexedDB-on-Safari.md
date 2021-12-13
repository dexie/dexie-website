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

## Safari version >= 10.1

Native support for IndexedDB 2.0. Lots of issues solved and performance boosted. For the most stable Safari support, use Dexie 3.0 (`npm install dexie@latest`). It works around the most major Safari issue and it continously runs its unit tests on Safari browsers in browserstack for every commit.

A list of Safari related issues that has been reported can be found [here](safari-issues.md)



## Chrome and Opera on IOS

Due to Apples restricted policies for iOS, Chrome and Opera running on iOS is actually a Safari browser in the backend pretending to be Chrome or Opera. Thus, it's IndexedDB is actually provided by Safari even on Chrome, Opera or Firefox, see [issue #110](https://github.com/dexie/Dexie.js/issues/110).

If your application must target iPhone 6 or below, it is recommended to include the indexedDB shim before requiring/including Dexie.js. iPhone 7 users will have a Safari engine of version >= 10.3.
