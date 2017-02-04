---
layout: docs
title: 'Dexie.delByKeyPath()'
---

Delete a property from object given a key path.

### Sample

```javascript
var obj = {
    name: "Kalle",
    address: {
        street: "East 13th Street",
        city: "New York"
    }
};

Dexie.delByKeyPath(obj, "address.street");
alert (obj.address.street); // Will alert (undefined);
```
