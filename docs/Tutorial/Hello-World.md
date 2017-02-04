---
layout: docs
title: 'Hello World'
---

```javascript
var db = new Dexie("FriendDatabase");

db.version(1).stores({
    friends: "++id,name,age"
});

db.open().catch (function (e) {
    alert ("Oh oh: " + e.stack);
});

db.friends.add({name: "Josephine", age: 21}).then(function(){
    return db.friends.where("age").between(20, 30).toArray();
}).then(function(friends) {
    alert ("Found young friends: " + JSON.stringify(friends));
    return db.friends.add({name: "Simon", age: 3});
}).then(function (id) {
    alert ("Simon got ID: " + id);
    return db.friends
             .orderBy("age")
             .reverse()
             .toArray();
}).then(function (friends) {
    alert ("Friends in reverse age order: " + JSON.stringify(friends));
}).catch (function (e) {
    alert ("Whoops!: " + e.stack);
});

```

### [Back to Tutorial](/docs/Tutorial)
