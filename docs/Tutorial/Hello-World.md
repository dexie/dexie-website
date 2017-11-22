---
layout: docs
title: 'Hello World'
---

```javascript
var db = new Dexie("FriendDatabase");

db.version(1).stores({
    friends: "id, name, age"
});

db.friends.bulkPut([
    {id: 1, name: "Josephine", age: 21},
    {id: 2, name: "Per", age: 75},
    {id: 3, name: "Simon", age: 5}
]).then(() => {

    return db.friends.where("age").between(0, 25).toArray();
    
}).then(friends => {

    alert ("Found young friends: " + JSON.stringify(friends));
    
    return db.friends
             .orderBy("age")
             .reverse()
             .toArray();
             
}).then(friends => {

    alert ("Friends in reverse age order: " + JSON.stringify(friends));
    
}).catch (function (e) {

    alert ("Ouch... " + e.stack);
});

```

### [Back to Tutorial](/docs/Tutorial)
