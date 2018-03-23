---
layout: docs
title: 'Dexie.addons'
---

This array contains functions that add functionality to Dexie. An addon may register itself in Dexie.addons by using `Dexie.addons.push(fn)`. Example:

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
(function(){

	function ForEachAddon (db) {
        // Makes it possible to use forEach() instead of each() on collections.
        db.Collection.prototype.forEach = db.Collection.prototype.each;
    }
    
	// Register the addon to be included by default (optional)
    Dexie.addons.push(ForEachAddon);

})();
```

### Using addons

Addons that register themselves to Dexie.addons (For example Dexie.Observable and Dexie.Syncable)

```javascript
import Dexie from 'dexie';
import 'dexie-syncable';

// db1 will have Dexie.Syncable
// (and its dependent module Dexie.Observable) activated.
var db1 = new Dexie("dbname");

// db2 will not have any addons activated
var db2 = new Dexie("dbname", {addons: []});
```

ES5:
```html
<script src="dexie.min.js"></script>
<script src="dexie-observable.min.js"></script>
<script src="dexie-syncable.min.js"></script>
<script>
    // db1 will have the addons activated automatically
    var db1 = new Dexie('dbname');
    // db2 will not have any addons activated
    var db2 = new Dexie('dbname', {addons: []}); 
</script>
```
