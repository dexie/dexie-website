---
layout: docs
title: 'Dexie.fakeAutoComplete()'
---

Helps IDE know how you will call your callback.

### Sample

```javascript
function callMeBack (callback) {
    Dexie.fakeAutoComplete(function() {
        callback ([new Date()]);
    });
}
```
Then, in your IDE, you write:

```javascript
callMeBack (function (a) {
    a._  // Here the IDE will know that a is an array of Date objects and autoComplete array methods as you type
});
```

### How it works

The function simply calls setTimeout(yourFunction) and then immediately calls clearTimeout(handle).

### Performance implications

Doing a loop of 100,000 calls to fakeAutoComplete() will result in the same time consumption as setting a property to an object twice. It is extremely fast.
