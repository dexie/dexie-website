---
layout: docs
title: 'Dexie.events()'
---

Create a set of events

### Sample

```javascript
function Car() {
    this.on = Dexie.Events(this, "move", "stop", "crash");
}

Car.prototype.move = function() {
    this.on.move.fire();
}

var car = new Car();
car.on('move', function() {
    alert ("Oh, it's moving!");
});
car.move();
```
