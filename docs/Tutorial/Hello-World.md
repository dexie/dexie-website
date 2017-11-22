---
layout: docs
title: 'Hello World'
---

```html
<!DOCTYPE html>
<html>
 <head>
  <script src="https://unpkg.com/dexie/dist/dexie.js"></script>
  <script>
  
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

        alert ("Found young friends: " +
			friends.map(friend => friend.name + friend.age));

        return db.friends
                 .orderBy("age")
                 .reverse()
                 .toArray();

    }).then(friends => {

        alert ("Friends in reverse age order: " +
			friends.map(friend => friend.name + friend.age));

    }).catch (function (e) {

        alert ("Ouch... " + e.stack);

    });
 
  </script>
 </head>
</html>
```

### [Back to Tutorial](/docs/Tutorial)
