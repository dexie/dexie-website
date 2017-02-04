---
layout: docs
title: 'Transaction.abort()'
---
Abort the transaction.

## Sample

```javascript
db.transaction("rw", db.friends, db.pets, function () {
    db.friends.add({name: "Zlatan", shoeSize: 47});
    Dexie.currentTransaction.abort(); // Will discard all changes.
}).catch(function (e) {
    // e will be an instanceof AbortError.
});
```
