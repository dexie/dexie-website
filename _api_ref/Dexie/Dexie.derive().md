---
layout: docs
title: 'Dexie.derive()'
---

Fixes the prototype chain for OOP inheritance.

### Sample

```javascript
function Vehicle () {}

Vehicle.prototype.move = function() {
    throw new Error ("Don't know how to move");
}

function Car() {}

Dexie.derive(Car).from(Vehicle).extend(function() {
    //
    // Private closure scope for private methods
    //
    function privFunc() {
        alert ("The wheels are rolling");
    }

    return {
        //
        //  Public methods here (all methods are put on Car.prototype)
        //

        move: function() {
            privFunc();
        }
    };
});

var car = new Car();
alert (car instanceof Vehicle); // alerts 'true'
car.move();
``` 
