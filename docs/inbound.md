---
layout: docs
title: 'Inbound'
---
A primary key is considered inbound if it's included in the stored objects.

#### Examples of inbound primary key

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


#### Example of non-inbound primary key

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

#### Working with Inbound Keys

```js
await db.friends.put({id: "fooId", name: "Foo"});
const friend = await db.friends.get("fooId");
```

#### Working with Non-inbound keys

```js
await db.friends.put({name: "Foo"}, "fooId");
const friend = await db.friends.get("fooId");
```
