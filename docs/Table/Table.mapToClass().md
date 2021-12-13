---
layout: docs
title: 'Table.mapToClass()'
---

Map the table to an existing javascript class

### Syntax

```javascript
table.mapToClass(constructor[, structure])
```

### Parameters
<table>
<tr><td>constructor: Function</td><td>Javascript constructor function</td><td></td></tr>
<tr><td><i>structure: Object !Deprecated</i></td><td>Definition of the properties available on instances of the class</td><td><i>deprecated, optional</i></td></tr>
</table>

### Return Value

Same constructor function as given as argument.

### Remarks

Makes any object extracted from this table become `instanceof` your given constructor function so that prototype methods and properties are possible to call on the extracted objects. Works with both ES5 and ES6 classes. Under the hood, the raw database objects are [shallow copied](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy) into new instances of your class constructed via [Object.create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) (constructor.prototype).

Applies only to instances returned by [Table.get()](/docs/Table/Table.get()), [Table.toArray()](/docs/Table/Table.toArray()), [Table.each()](/docs/Table/Table.each()), [Collection.toArray()](/docs/Collection/Collection.toArray()), [Collection.each()](/docs/Collection/Collection.each()), [Collection.first()](/docs/Collection/Collection.first()), [Collection.last()](/docs/Collection/Collection.last()) but not for callbacks that are part of the filtering query: [Collection.filter()](/docs/Collection/Collection.filter()), [Collection.and()](/docs/Collection/Collection.and()) and [Collection.modify()](/docs/Collection/Collection.modify()) or if [Collection.raw()](/docs/Collection/Collection.raw()) is being used. In all the latter cases, the methods will emit plain javascript Object instances directly from the database without cloning it into an instance of the mapped class.

Notably does not apply to any of the hook functions ([Table.hook('creating')](/docs/Table/Table.hook('creating')), [Table.hook('updating')](/docs/Table/Table.hook('updating')), [Table.hook('reading')](/docs/Table/Table.hook('reading')), [Table.hook('deleting')](/docs/Table/Table.hook('deleting'))).  To resolve the objects passed to these hooks to the appropriate class, first clone the base object, then apply key changes, then use [Object.create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create).  Everything except the `Object.create` step is demonstrated in the [Dexie.Observable](https://github.com/dexie/Dexie.js/blob/master/addons/Dexie.Observable/src/Dexie.Observable.js#L339) addon.

### NOTICE!

 * Structure argument (deprecated) only helps with code completion and documentation of the class. It will not instantiate properties on the instances returned from the database.
 * Given constructor function wont be invoked for instances returned from database. Only the inheritance chain will be applied so that methods attached to constructor.prototype can be called upon and the `instanceof` operator will return true for the constructor.

### Sample (ES6)

```javascript
import Dexie from 'dexie';

var db = new Dexie("FriendsDB");
db.version(1).stores({
    friends: "++id,name,shoeSize,address.city"
});

class Friend {
    log() {
        console.log(JSON.stringify(this));
    }
}

db.friends.mapToClass (Friend);

db.friends.where("name").startsWithIgnoreCase("d").each(function(friend) {
    assert (friend instanceof Friend);
    friend.log();
}).catch(function (e) {
    console.error(e);
});
```

### Sample (Typescript)

```typescript
import Dexie from 'dexie';

export class FriendsDB extends Dexie {
    friends: Dexie.Table<Friend, number>;

    constructor() {
        super("FriendsDB");
        this.version(1).stores({
            friends: "++id,name,shoeSize,address.city"
        });
        this.friends.mapToClass (Friend);
    }
}

export class Friend {
    name: string;
    shoeSize: number;
    cars: [{
        brand: string,
        model: string
    }];
    address: {
        street: string,
        city: string,
        country: string
    }

    log() {
        console.log(JSON.stringify(this));
    }
}

db.friends.where("name").startsWithIgnoreCase("d").each(function(friend) {
    assert (friend instanceof Friend);
    friend.log();
}).catch(function (e) {
    console.error(e);
});
```

