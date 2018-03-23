---
layout: docs
title: 'Collection.clone()'
---
### Syntax

```javascript
collection.clone()
```

### Return Value

Collection instance that derive from the original Collection via prototype. And manipulations on the returned Collection wont affect the original query.

### Note

Does not clone the database contents, just object instance of the Collection object.

### Sample

```javascript

db.transaction('r', db.friends, function* () {
    var collection = db.friends.where('age').above(75);

    // Manipulate further without affecting original query:
    var clone = collection.clone().reverse().limit(1);  

    // Execute un-manipulated original query:
    var allOldFriends = yield collection.toArray(); // Returns all old friends.

    // Execute cloned and manipulated query:
    var oldestFriend = yield clone.toArray(); // Returns just the oldest friend.

}).catch (e => {
    console.error(e.stack);
});
```

