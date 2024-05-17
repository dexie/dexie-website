---
layout: docs
title: 'Promise.PSD'
---

Dexie.Promise.PSD is a custom [Async Context](https://github.com/tc39/proposal-async-context) to maintain ongoing database [transactions](/docs/Dexie/Dexie.transaction()). Unlike other zone implementations, Dexie's zones are unobtrusive, meaning that the zone system does not require including any monkey-patching script or import. Dexie is not dependant on zone.js or any other zone implementation.

As of Dexie 2.0.0, this system is also capable of maintaining contexts between await expressions (both transpiled and browser-native. The zone system has been tested agains native await with Chrome 55+, Edge 14+, Firefox, Opera and Safari. Transpiled support has been tested with babel and typescript).

### Syntax

```javascript
// Create a PSD scope
Dexie.Promise.newPSD (function () { 

    // Put something in it.
    Dexie.Promise.PSD.promiseSpecificVariable = 3; 

    // Create a promise that uses it
    new Dexie.Promise(function (resolve, reject) {
        setTimeout(resolve, 1000);
    }).then (function () {
        // This callback will get same PSD instance as was active when .then() was called
        assert (Dexie.Promise.PSD.promiseSpecificVariable == 3);
    });
});
```

### Description

Analogous to [Thread-specific data](http://en.wikipedia.org/wiki/Thread-Specific_Data), Promise-specific data contains static data bound to the execution flow of a Promise flow or tree.

### Purpose

In the threading world, [Thread-specific data](http://en.wikipedia.org/wiki/Thread-Specific_Data) can be used to hold a state on the currently executing thread. Authorization Engines often use thread-specific data to hold the current authenticated principal instead of having to pass that object around, which makes authorization more reliable, logging frameworks also rely on thread-specific content so that current username can be invoked in each log entry without a component needing to know about that when calling .log(). [Reentrant mutexes / recursive locking](http://en.wikipedia.org/wiki/Reentrant_mutex) is another important pattern that enables one function to lock a mutex, then call other sub functions that also locks the same mutex without a deadlock arising. PSD makes that pattern possible in the "Promise land"...

In Dexie, PSD is used for:
 * Maintaining transaction scopes
 * Enabling reentrant write-locks on transactions
 * Enabling subscribers to db.on('ready') work on db before db.open() completes
 * Tracking [live queries](/docs/liveQuery())

### Difference Between [Thread-specific data](http://en.wikipedia.org/wiki/Thread-Specific_Data) and PSD
Thread-specific Data is one-dimensional. You can set Thread-static property that will be set for the currently running thread. PSD is a tree (or stack on most cases) where each new PSD acts as a stack frame that will derive from its parent. This makes PSD data automatically disappear when a Promise.newPSD() goes out of scope. This is also necessary since Promise chains (unlike threads) can all root down the the same promise but be forked on certain frames.

### Difference from Angular's Zone.js
Dexie's zone system is unobtrusive, meaning that it does not require your application to include a monkey-patching script at the top of the HTML page. Dexie's zone system only maintains contexts between promises and does not propagate contexts into other async apis, such as setTimeout() etc.

### Non-Standard

PSD is Dexie-proprietary invention and is not standardized in any Promise specification. We'll be following the [TC39 AsyncContext proposal](https://github.com/tc39/proposal-async-context) closely and gradually adapt the API to align with the specification.

### How To Use

```javascript
Dexie.Promise.newPSD(function() {
    // In this function, we have a Dexie.Promise.PSD to work with.
    Dexie.Promise.PSD.myVar = 3;
    
    new Dexie.Promise(function(resolve, reject){
        // Promise constructor will derive from current scope:
        alert (Dexie.Promise.PSD.myVar); // Will alert "3"
        // Let's resolve the promise to explain the then() method:
        setTimeout(resolve, 100);
    }).then (function(){
        // Here, we have the same PSD as when Promise instance was created
        alert (Dexie.Promise.PSD.myVar); // Will alert "3"
    }).catch (function() {
        alert (Dexie.Promise.PSD.myVar); // Would alert "3" as well
    });
});

alert (Dexie.Promise.PSD);
// Will alert "null" (unless code was called from other Promise)
```

### Sub Scopes

In case calling Dexie.Promise.newPSD() when already in a PSD scope (Dexie.Promise.PSD !== null), the new PSD will derive prototypically from the outer PSD scope.

```javascript
//
// top-level: Dexie.Promise.PSD === null
//
Dexie.Promise.newPSD(function() {
    //
    // Root-scope:
    //

    // Play with PSD:
    Dexie.Promise.PSD.myVar = 3; 
    alert (Dexie.Promise.PSD.myVar); // Will alert ("3") (obviously)

    Dexie.Promise.newPSD(function() {
        //
        // Sub-scope: Current PSD derives from parent PSD.
        //

        // Play with PSD: Override myVar but dont change parent value:
        Dexie.Promise.PSD.myOtherVar = 18;

        alert (Dexie.Promise.PSD.myVar); // Will alert ("3") (derived value)
        alert (Dexie.Promise.PSD.myOtherVar); // Will alert ("18") (direct val)   
    });

    // Back to root scope:

    alert (Dexie.Promise.PSD.myOtherVar); // Will alert ("null")
    alert (Dexie.Promise.PSD.myVar); // Will alert ("3")
});

// At this point, Dexie.Promise.PSD === null again.
```
