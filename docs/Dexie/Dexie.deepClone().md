---
layout: docs
title: 'Dexie.deepClone()'
---

Clones an object or array completely but still lets any instance of Date or custom classes keep their prototypal structure.

### Sample:

```javascript
var obj = {
    name: "Kalle",
    friends: [{name: "Olle", date: new Date(), cars: [new Car()]}]
}

var clone = Dexie.deepClone(obj);
// Now, clone will be totally "disconnected" from obj,
// including nestled arrays and objects.
// The date objet will still be a Date instance.
// The cars array will still be an array of Car instances.
// The following is true: ((clone.friends[0].cars[0] instanceof Car) === true)
```

