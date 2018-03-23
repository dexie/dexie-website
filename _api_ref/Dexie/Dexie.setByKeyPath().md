---
layout: docs
title: 'Dexie.setByKeyPath()'
---

Modify a property in an object given a key path and value.

### Sample

```javascript
var obj = {
    name: "Kalle",
    address: {
        street: "East 13th Street",
        city: "New York"
    }
};

Dexie.setByKeyPath(obj, "address.street", "Elm Street");
alert (obj.address.street); // Will alert ("Elm Street");
```
