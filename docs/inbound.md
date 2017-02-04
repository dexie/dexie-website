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
