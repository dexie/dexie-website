---
layout: docs
title: 'Dexie.currentTransaction'
---

### Syntax

```javascript
var trans = Dexie.currentTransaction;
```

### Type

[Transaction](/docs/Transaction/Transaction)

### Description

If accessed from within a [transaction scope](/docs/Dexie/Dexie.transaction()), this property will contain the current [Transaction](/docs/Transaction/Transaction) instance. If not within a [transaction scope](/docs/Dexie/Dexie.transaction()) scope, this property will be null.

The property is a [Promise-local data](/docs/Promise/Promise.PSD) variable and requires you to be in a Dexie.Promise flow. If you're using other Promise implementations, Dexie.currentTransaction will always be null.

