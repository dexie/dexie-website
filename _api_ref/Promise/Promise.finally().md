---
layout: docs
title: 'Promise.finally()'
---

### Syntax

```javascript
promise.finally(function callback() {
    // Do stuff when promise resolves or is rejected
})
```

### Return Value

A new [Promise](/docs/Promise/Promise) instance that will once again resolve or reject after executing the finally-callback. 

### Description

Makes it possible to execute code when Promise is resolved or rejected. Like the catch() and then() methods, this method will also return a new [Promise](/docs/Promise/Promise) instance. The difference is that the finally() method will not affect the state - the returned Promise will resolve or reject the same way as the original Promise. However, if an error occur in the finally() callback, then the returned Promise will reject with the exception thrown.

### Sample

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
}).finally (function() {
    alert ("Finished!");
});
```
