---
layout: docs
title: 'Collection.filter()'
---

### Syntax

```javascript
collection.filter(filter)
```

### Parameters

<table>
<tr><td>filter: Function</td><td>function (value) { return true/false; }</td></tr>
</table>

### Return Value

This Collection instance (**this**)

### Remarks

This method is identical to [Collection.and()](/docs/Collection/Collection.and())

### Sample

```javascript
const collection = db.friends
  .orderBy('age')
  .filter((friend) => /foo/i.test(friend.name));
  
const result = await collection.offset(50).limit(25).toArray();
```
