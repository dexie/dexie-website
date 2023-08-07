---
layout: docs
title: 'Promise.catch()'
---

### Syntax

```javascript
promise.catch(function callback (error) {
    // Handle error
});

promise.catch(ErrorType, function callback (error) {
    // Handler error of ErrorType.
});

promise.catch(name, function callback (error) {
    // Handler error where error.name === name
});
```

### Parameters

<table>
<tr><td>ErrorType</td><td>Constructor function for the type of the error to catch</td></tr>
<tr><td>name</td><td>Value of the name property of the error to catch</td></tr>
<tr><td>callback</td><td>Callback to run when error occur</td></tr>
</table>

### Return Value

The method will return another [Promise](/docs/Promise/Promise) that will resolve with the return value of given callback.

### Description

Promise/A+ compliant catch() method. Enables caller to supply a callback to run if the promise fails. The return value of the catch callback will work as the resolve value for the returned promise.

This implementation also support to catch specific error types.

### Dexie Specific

If you catch an operation you also tell Dexie that you are handling it which prohibit the transaction from aborting:

```javascript
db.friends.add(newFriend).catch((error) => {
    // Error handled and transaction will not abort.
});
```

If you are catching an operation for logging purpose and do not want to mark it as "handled", you could rethrow the error or return a rejected promis:

```javascript
db.friends.add(newFriend).catch((error) => {
    console.error("Failed to add new friend. Error: " + error);
    return Promise.reject(error);
});
```
Catching at transaction level is another way to log without prohibiting transaction from aborting:

```javascript
db.transaction('rw', db.friends, function () {
    db.friends.add(newFriend);
}).catch (function (error) {
    console.error ("Transaction aborted due to error: " + error);
});
```

### Samples

#### Catching Error Events

```javascript
var db = new Dexie('db');
db.version(1).stores({friends: 'email,name'});
db.open();

// Un-remark following line to make it fail due to ConstraintError:
//  db.friends.add({email: "abc@def.com", name: "Oliver"}); 
db.friends.add({email: "abc@def.com", name: "Gertrud"}).then(function() {
    alert ("Successfully added friend into DB");
}).catch (function (e) {
    alert ("Failed to add friend into DB: " + e);
});
```

#### Catching Thrown Exceptions

```javascript
var db = new Dexie('db');
db.version(1).stores({friends: 'email,name'});
db.open();

db.friends.add({email: "abc@def.com", name: "Gertrud"}).then(function() {
    throw new Error ("Ha ha ha!");
}).catch (function (e) {
    alert ("Failed: " + e.toString());
});
```

#### Catching Specific Error Types

```javascript
var db = new Dexie('db');
db.version(1).stores({friends: 'email,name'});
db.open();

// Un-remark following line to make it fail due to ConstraintError:
//  db.friends.add({email: "abc@def.com", name: "Oliver"}); 
db.friends.add({email: "abc@def.com", name: "Gertrud"}).then(function() {
    alert ("Successfully added friend into DB");
}).catch (DOMError, function (e) {
    alert ("DOMError occurred: " + e);
}).catch (function (e) {
    alert ("Unknown error occurred: " + e);
});
```

#### Catching Error of Specific 'name'

Sometimes the error type doesn't tell exactly what error occurred. IndexedDB for example, will always fail with a DOMError, where its name property tells the actual reason. Dexie.Promise has support for supplying a string as first argument. By doing that, the name property of the error is checked against the given string.

```javascript
var db = new Dexie('db');
db.version(1).stores({friends: 'email,name'});
db.open();

// Un-remark following line to make it fail due to ConstraintError:
//  db.friends.add({email: "abc@def.com", name: "Oliver"}); 
db.friends.add({email: "abc@def.com", name: "Gertrud"}).then(function() {
    alert ("Successfully added friend into DB");
}).catch ('ConstraintError', function (e) {
    alert ("ConstraintError occurred: " + e);
}).catch (function (e) {
    alert ("Unknown error occurred: " + e);
});
```

### See Also

[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
