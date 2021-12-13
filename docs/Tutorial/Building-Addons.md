---
layout: docs
title: 'Building Addons'
subtitle: Dexie is designed for being extended by addons.
---

## Methods for Extending Dexie

The [Dexie.addons](/docs/Dexie/Dexie.addons) array contains functions that extend Dexie. An addon may register itself in Dexie.addons by using `Dexie.addons.push(fn)`.

Example:

```javascript
import Dexie from 'dexie';

export function ForEachAddon (db) {
    // Makes it possible to use forEach() instead of each() on collections.
    db.Collection.prototype.forEach = db.Collection.prototype.each;
}
    
// Register the addon to be included by default (optional)
Dexie.addons.push(ForEachAddon);
```

ES5:

```javascript
function ForEachAddon (db) {
    // Makes it possible to use forEach() instead of each() on collections.
    db.Collection.prototype.forEach = db.Collection.prototype.each;
}
    
// Register the addon to be included by default (optional)
Dexie.addons.push(ForEachAddon);
```

### Understanding where Dexie classes reside

Dexie classes such as Collection and Table are created in the closure scope of the Dexie constructor. To extend the prototypes you must work with an instance of Dexie. See example above.

### Overriding existing methods

To override an existing method on any class, you can just change its current value to your own function. A handy function for overriding is the Dexie.override() function. Example:

```javascript
db.Collection.prototype.each = Dexie.override (db.Collection.prototype.each, function (originalEach) {
    return function () {
        var returnValue = originalEach.apply(this, arguments);
        // Do some more stuff
        return returnValue;
    }
});
```

### Protected methods

The API Reference does not document the protected methods and properties of Dexie. You may however look into the code and find lots of methods and properties with a leading underscore. Your addon may then override protected methods to change the behaviour of the database engine.
To see an example of this, look at how [Dexie.Observable.js](https://github.com/dexie/Dexie.js/blob/master/addons/Dexie.Observable/src/Dexie.Observable.js) is implemented.

Note: We will try to keep all the not-yet-documented underscore properties and methods backward compatible as much as possible, but it's not a guarantee. To be certain we inform you about important API changes, please let [us](https://github.com/dexie/Dexie.js/graphs/contributors) know about your addon and where to find its source. To be even more certain, let your addon reside under your fork of Dexie.js/addons and keep us updated with pull requests.

### When to use prototype and when not

All inner classes (Collection, WhereClause, Table, Transaction, etc.) use prototype for all their methods. This is because it will optimize instance creations. But the main Dexie class itself does not use prototype for now since instance creation is more rare with the main class which is typically singleton.

So to extend or override methods on the main class (Dexie), you should change the property on the given db instance that your addon retrieves as its first argument. For all other internal classes, such as Collection, WhereClause, Table, etc, all methods are prototyped, so you can override the prototype of those.

### Creating Subclasses

Another way to extend Dexie is to derive from it or make your extension create new classes that derives from existing ones. For example, you could derive from Table and then override the protected method db._tableFactory() method and create your instance there.

### Alternate way of doing an addon

Instead of registering into Dexie.addons, you could instead create a derived class and call it something else. Example:

```javascript
import Dexie from 'dexie';

class MyDerivedDexie extends Dexie {
	anotherProperty;
	
	anotherMethod() {
		// Do something here...
	}

    constructor (name, options) {
		super(name, options);
		this.anotherProperty = "other prop";
    }
}
```

ES5:

```javascript
function MyDerivedDexie (dbname, options) {
    Dexie.call(this, dbname, options);
    this.anotherProperty = "other prop";
    this.anotherMethod = function () {
        // Do something here...
    };
}
```

To use the addon:

```javascript
var db = new MyDerivedDexie("DerivedSampleDB");
alert (db.anotherProperty);
db.anotherMethod ();
```

### Creating an AMD based addon

If you write a pure AMD based addon, you should (by convention) not register it to Dexie.addons but let the module user explicitely provide your addon as an option to the Dexie constructor.

```javascript
define('Dexie.NequalAddon', ["Dexie"], function (Dexie) {
    function NequalAddon (db) {
        db.WhereClause.prototype.notEqualTo = function (value) {
           return this.below(value).or(this._ctx.index).above(value);
        };
    }
    return NequalAddon;    
});
```

To use your addon:

```javascript
require(['Dexie', 'Dexie.NequalAddon'], function (Dexie, DexieNequalAddon) {
    var db = new Dexie('testdb', {addons: [DexieNequalAddon]});
    db.version(1).stores({...});
    db.open();
    ...
});
```
