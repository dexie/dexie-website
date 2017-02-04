---
layout: docs
title: 'IndexedDB on Safari'
---
## Safari versions below 8
* No support for indexedDB
* There's a shim that builds indexedDB support on top of WebSQL: [IndexedDBShim](https://github.com/axemclion/IndexedDBShim/tree/master/dist). This shim is not bug free either though but under [constant development](https://github.com/axemclion/IndexedDBShim/)

## Safari version 8.x
* Native support for indexedDB but has lots of [issues](http://www.raymondcamden.com/2014/09/25/IndexedDB-on-iOS-8-Broken-Bad):
  1. Transactions can only target a single object store at a time.
  2. Primary keys must be unique **across** different objects stores.
  3. Compound indexes or primary keys are not supported.
  4. MultiEntry indexes not supported.

## Chrome and Opera on IOS
Thanks to Apples restricted policies for iOS, Chrome and Opera running on iOS is actually a Safari browser in the backend pretending to be Chrome or Opera. Thus, it suffers from all the indexedDB bugginess that comes with the native indexedDB support in Safari. See Issue #110.

If your application will target any iOS platform or Safari browser, it is still recommended to include the indexedDB shim before requiring/including Dexie.js on iOS systems independantly on which browser is running, and on all Safari browsers, independently on whether they have native indexedDB support or not.

If IndexedDBShim is included before Dexie, Dexie will prefer the Shim over any native indexedDB implementation. This is because it must be possible to use the shim instead of the native and buggy safari indexedDB implementation.
