---
layout: docs
title: 'Dexie.on.close'
---

### Syntax

```javascript
db.on("close", () => console.log("db was closed"));
```

### Description

The "close" event occurs if database is forcibly closed from external action. The event is not fired when calling db.close().

See corresponding docs on MDN: https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/close_event
