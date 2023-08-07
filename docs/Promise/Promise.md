---
layout: docs
title: 'Promise'
---

Represents an ECMAScript 6 compliant Promise/A+ implementation. All Dexie methods that return a Promise will return a Dexie.Promise rather than native Promise.

### Syntax

```javascript
return new Dexie.Promise(function (resolve, reject) {
    // Do something and call resolve / reject when done.
}).then(function (result) {
    // This code is called if resolve() was called in the Promise constructor
}).catch(function (error) {
    // This code is called if reject() was called in the Promise constructor, or
    // if an exception was thrown in either constructor or previous then() call.
}).finally(function () {
    // This code will be called no matter if an error occurred or not.
});
```

### Description

Implementation of a Promise/A+ documented at <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise>.

See also [Best Practices - Understand Promises](/docs/Tutorial/Best-Practices#1-understand-promises.)

### Why we don't use native Promise

As of May 2018, all modern browsers started supporting Promises withing IndexedDB transactions. So the initial reason for introducing an alternate Promise implemetation is not as accurate as before. At least in the long term as users move away from old browsers. However, we also use Dexie.Promise to interact with native promises in order to maintain transaction zones, so we still need to have Dexie.Promise accomplish that for us.

### Interopability

[Dexie.Promise](/docs/Promise/Promise) can be used in conjunction with the standard Promise implementation in ES6 as well as Q- and other A+ compatible Promise implementations in both directions. It can also cope with simple [thenables](https://promisesaplus.com/#point-7) in one direction.

##### Mix with any [thenable](https://promisesaplus.com/#point-7) implementation:

```javascript
db.cars.where('brand').equals('Volvo').then( function(cars) {
    // Post my cars to the server:
    return jQuery.ajax({
        url: "foobar",
        data: cars,
        type: 'post'
    }); // Another promise is returned
}).then(function(response) {
    // Handle successful ajax response
}).catch(function(error) {
    // Handle error
});
```
##### Do the other way around (this time a A+ compliant Promise needed):

```javascript
new window.Promise(function(resolve, reject) {
    resolve("something");
}).then(function (x) {
    console.log(x);
    return db.cars.where('brand').equals('Volvo');
}).then( function(cars) {
    // Here we get the cars array from Dexie,
    // delivered through the standard Promise implementation.
    console.log(cars.join(JSON.stringify()));
}).catch(function(error) {
    // Handle error standardized
});
```

##### ...but avoid it within [transactions](/docs/Dexie/Dexie.transaction()):

```javascript
db.transaction('rw', db.cars, function () {
    //
    // Transaction block
    //
    db.cars.put({id: 3}).then (function() {
        // Avoid returning other kinds of promises here:
        return new Bluebird(function(resolve, reject){
            resolve();
        });
    }).then(function() {
        // You'll successfully end-up here, but any further call to db
        // will fail with "Transaction Inactive" error.
        return db.cars.get(3); // WILL FAIL WITH TRANSACTION INACTIVE!
    });
});
```

The main reason for not using it within transactions is due to an [incompatibility between the IndexedDB specification and the Promise specification](https://github.com/promises-aplus/promises-spec/issues/45). Another reason is that only [Dexie.Promise](/docs/Promise/Promise) has the capability to keep track of the currently executing transaction between calls (See [Promise.PSD](/docs/Promise/Promise.PSD)).

window.Promise is always safe to use within transactions, as Dexie will patch the global Promise within the transaction zone, but leave it untouched outside the zone.

### Methods

#### [then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#### [catch()](/docs/Promise/Promise.catch())

#### [finally()](/docs/Promise/Promise.finally())

### Static Methods

#### [Promise.resolve()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#### [Promise.reject()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#### [Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#### [Promise.race()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#### [Promise.newPSD()](/docs/Promise/Promise.PSD)

### Static Properties

#### [PSD](/docs/Promise/Promise.PSD)

### Events

#### [onuncatched](/docs/Promise/Promise.onuncatched)
*Deprecated. Use [window.addEventListener('unhandledrejection')](/docs/Promise/unhandledrejection-event)*

#### [Promise.on('error')](/docs/Promise/Promise.on.error)
*Deprecated. Use [window.addEventListener('unhandledrejection')](/docs/Promise/unhandledrejection-event)*

### Implementation Details

This implementation is a fork of promise-light (<https://github.com/taylorhakes/promise-light>) by <https://github.com/taylorhakes> - an A+ and ECMASCRIPT 6 compliant Promise implementation.

Modified by David Fahlander to be indexedDB compliant (See discussion: <https://github.com/promises-aplus/promises-spec/issues/45>).

This implementation executes a virtual Micro Task engine when possible, that replaces the need for calling setImmediate (), setTimeout(), etc.. This is needed only when dealing with indexedDB transactions in older browsers where native promises don't cope with indexedDB transactions [See issue #317](github.com/dfahlander/Dexie.js/issues/317). It does this without sacrificing A+ compliance since the microtick engine can be considered part of the host system and is invisible and undetectable from the user. 

This topic was also discussed in the following thread: <https://github.com/promises-aplus/promises-spec/issues/45>.

See also <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise>
