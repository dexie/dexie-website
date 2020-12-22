---
layout: docs
title: 'Inbound'
---
A primary key is considered inbound if it's included in the stored objects.

## Examples of Inbound Primary Key

```javascript
db.version(1).stores({
    friends: "id"
});
```

```javascript
db.version(1).stores({
    friends: "id,name"
});
```

```javascript
db.version(1).stores({
    friends: "++id,name"
});
```

### Adding / Updating Inbound Values

```js
await db.friends.add({id: "fooId", name: "Foo"});

await db.friends.put({id: "fooId", name: "Foo"});

await db.friends.bulkAdd([{id: "id1", name: "Friend1"}, {id: "id2", name: "Friend2"}]);

await db.friends.bulkPut([{id: "id1", name: "Friend1"}, {id: "id2", name: "Friend2"}]);

```


## Example of Outbound Primary Key

```javascript
db.version(1).stores({
    friends: ""
});
```

```javascript
db.version(1).stores({
    friends: ",name"
});
```

```javascript
db.version(1).stores({
    friends: "++,name"
});
```

### Adding / Updating Outbound Values

```js
await db.friends.add({name: "Foo"}, "fooId"); // Specify key as 2nd argument

await db.friends.put({name: "Foo"}, "fooId"); // Specify key as 2nd argument

await db.friends.bulkAdd(
  [{name: "Friend1"}, {name: "Friend2"}],
  ["id1", "id2"] // Specify keys array in 2nd arg
);

await db.friends.bulkPut(
  [{name: "Friend1"}, {name: "Friend2"}],
  ["id1", "id2"] // Specify keys array in 2nd arg
);

```

