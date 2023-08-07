---
layout: docs
title: 'Promise.onuncatched'
---

Called if the promise wasn't caught.

***Deprecated. This event is deprecated and obsolete since 4.x***

#### Sample

```javascript
var p = new Promise(function (resolve, reject) {
    reject("Failed!");
});
p.onuncatched = function (e) {
    alert ("No-one caught this error: " + e);
}
```

Result:

Since neither `then(x, f)`, `catch(f)` or `finally(f)` was called with a valid function f, the alert would be fired.

#### How this is used in Dexie

Dexie uses this event on all returned promises from any DB operation on a Transaction in order to make sure error is propagated to the transaction and that transaction is aborted.
