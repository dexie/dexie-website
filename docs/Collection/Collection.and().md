---
layout: docs
title: 'Collection.and()'
---
### Syntax

```javascript
collection.and(filter)
```

### Parameters

<table>
<tr><td>filter: Function</td><td>function (value) { return true/false; }</td></tr>
</table>

### Return Value

This Collection instance (**this**)

### Remarks

This method is identical to [Collection.filter()](/docs/Collection/Collection.filter())

### Sample

```javascript
const collection = db.friends
  .where('age').between(25, 30, true, true)
  .and(friend => /foo/i.test(friend.name));
  
const result = await collection.offset(50).limit(25).toArray();
```
