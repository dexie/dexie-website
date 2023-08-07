---
layout: docs
title: 'Simplify with yield'
---

Targeting modern browsers only? (Building Chrome apps, Firefox apps or Electron Desktop apps or just target modern browsers like Chrome, Opera, Firefox or Edge, Android WebView or Chrome for Mobile, or if you transpile your code from ES6 to ES5)?.

No reason to not start consuming promises using the **yield** keyword.

The principle is simple:

1. Use the latest version of Dexie (1.3 or later)
2. Use Dexie.spawn() or Dexie.async() to enable a synchronous-like programming style.
3. Each method that returns a Promise can be awaited using **yield**.

Exactly the same way as ES7's async/await works (but unlike async/await this works in current modern browsers without transpilation).

## Sample use

```javascript
var Dexie = require('dexie');
var async = Dexie.async,
    spawn = Dexie.spawn;

var db = new Dexie('testdb');

db.version(1).stores({
    people: '++id,name,age',
    assets: '++id,ownerId,assetName'
});

spawn(function*() {

    //
    // Write your synchronous-like code within a spawn() block
    //

    // Add a person:
    var id = yield db.people.add({name: 'Foo', age: 34});
    // Add two assets that links to the newly added person:
    yield db.assets.bulkAdd([
        {assetName: "car", ownerId: id},
        {assetName: "house", ownerId: id}
    ]);

    // Now, list all people and their assets:
    var people = yield db.people.toArray();
    for (var i=0; i<people.length; ++i) {

        var assets = yield db.assets
                .where('ownerId').equals(people[i].id)
                .toArray();

        console.log(`${people[i].name}'s assets: ${assets.map(a => a.assetName).join(',')}`);
    }


}).then(function() {

   //
   // spawn() returns a promise that completes when all is done.
   //
   console.log("Complete");

}).catch(function(e) {

   //
   // If any error occur in DB or plain exceptions, you
   // may catch them here.
   //
   console.error("Failed: " + e);
});
```

## Use in db.transaction()

[Dexie.transaction()](/docs/Transaction/Dexie.transaction()) will treat generator functions (function) so that it is possible to use yield for consuming promises.

```javascript
var Dexie = require('dexie');
var async = Dexie.async;
var spawn = Dexie.spawn;

var db = new Dexie("myDB");
db.version(1).stores({
	friends: '++id, name, age'
});
db.open();

db.transaction('rw', db.friends, function*(){
	var friendId = yield db.friends.add({name: "Foo", age: 42});
	console.log("Got id: " + friendId);
	console.log("These are my friends: " + JSON.stringify(yield db.friends.toArray()));
	yield db.friends.delete(friendId);
	console.log ("Friend successfully deleted.");
}).catch(e => alert ("Oops: " + e));
```

## async

Marking a generator function as async() will make yield statements behave like ES7 await. This is not needed in transaction callbacks (as above sample shows) but can be used
whenever you need to do several transactions, or not use transactions at all.

```javascript
var Dexie = require('dexie');
var async = Dexie.async;
var spawn = Dexie.spawn;

...

var listFriends = async(function*() {
	var friends = yield db.friends.toArray();
	return friends;
});

listFriends()
	.then(friends => console.log(JSON.stringify(friends)))
	.catch(e => console.error (e.stack));
```

## spawn

Another style is using spawn() instead of async(). Then you don't need to store your async functions in vars.

```javascript
var Dexie = require ('dexie');
var async = Dexie.async;
var spawn = Dexie.spawn;

...

function* listFriends () {
	var friends = yield db.friends.toArray();
	return friends;
};

spawn(listFriends)
	.then(friends => console.log(JSON.stringify(friends)))
	.catch(e => console.error (e.stack));

```

## Calling Sub Functions

There are two possible of structuring your code with sub functions.

* Method 1: Declare each function with Dexie.async(). Declaring each function with async is most declarative but requires var declaration with function* expressions instead of function* statements.
* Method 2: Just declare as `function* myFunc(){ ... }`. This method gives cleaner code, but it requires the jsdocs to clarify how they are supposed to be consumed. Generator functions are not always used for emulating async/await, so it cannot be assumed that they should be called via spawn() or yield*.

### Method 1

NOTE: Using ES5 style vars to make the samples work in today's browsers (March 2016).

```javascript
var async = Dexie.async;

var incrementAge = async(function* (friendId) {
    yield db.friends
        .where('id').equals(friendId)
        .modify(friend => ++friend.age);
});

var listFriends = async(function* () {
	var friends = yield db.friends.toArray();
	return friends;
});

var birthdays = async(function* () {
    var friends = yield listFriends();
    for (var i=0; i<friends.length; ++) {
        yield incrementAge(friends[i].id);
    }
});
```

### Method 2

Rule of thumb is:

* Calling a generator function will give you an Iterable, not a Promise.
* When awaiting a Promise (for example returned from Dexie API), use `yield`.
* When awaiting an Iterable (the result from calling a `function*`), use `yield*`

```javascript
function* incrementAge(friendId) {
    yield db.friends
        .where('id').equals(friendId)
        .modify(friend => ++friend.age);
}

function* listFriends () {
    var friends = yield db.friends.toArray();
    return friends;
}

function* birthdays() {
    var friends = yield* listFriends();
    for (var i=0; i<friends.length; ++) {
        yield* incrementAge(friend[i].id);
    }
}

Dexie.spawn(birthdays).catch(e => console.error (e));

```

## How this maps to ES7 async / await

Table below shows how this maps to ES7 async / await.

<table>
  <tr><td></td><td>Using function*() and yield</td><td>Using async / await</td></tr>
  <tr><td>Declare async function</td><td>Dexie.async(function* () {});</td><td>async function() {}</td></tr>
  <tr><td>Declare+execute function</td><td>Dexie.spawn(function* () {});</td><td>(async function() {})()</td></tr>
  <tr><td>Await a Promise</td><td>yield p;</td><td>await p;</td></tr>
  <tr><td>Declare Promise Generator</td><td>function* f (){}</td><td>N/A</td></tr>
  <tr><td>Await Promise Generator</td><td>yield* fn();</td><td>N/A</td></tr>
</table>

## Motivation

You can also find the spawn() and async() helpers other libs like Q, Task.js etc. The reason why we need 'yet another' one, is because those will all
return their specific types of Promises, which in some browsers are incompatible with indexedDB transactions. That's also the main reason Dexie
needs its own Promise implementation. Furthermore, Dexie Promises are capable of maintaining Promise-Specific Data (analogous to Thread-specific data)
and utilize that for maintaining transaction scopes and reentrant transaction locks.

However, the Dexie versions of async() and spawn() will adapt to any promise implementation so you can use it to consume other promises as well if you like.
