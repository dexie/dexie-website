---
layout: docs
title: 'Dexie.getByKeyPath()'
---

Retrieve a property from an object given a key path.

### Sample

```javascript
var obj = {
    name: "Kalle",
    address: {
        street: "East 13th Street",
        city: "New York"
    }
};

alert (Dexie.getByKeyPath(obj, "name")); // Will alert "Kalle";
alert (Dexie.getByKeyPath(obj, "address.street")); // Will alert "East 13th Street";
```
