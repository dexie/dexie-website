---
layout: docs
title: 'Transaction.on.abort'
---

## Syntax

```javascript
trans.on("abort", function () {
    // Do stuff when transaction aborts
});
```

## Example

```javascript
db.transaction('rw', db.friends, function() {
    Dexie.currentTransaction.on('abort', function(){
        console.log('Transaction aborted');
    });
});
```
