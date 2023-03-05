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
  .where('age').above(25)
  .and(friend => /foo/i.test(friend.name));
  
const result = await collection.offset(50).limit(25).toArray();
```
*The sample uses the `age` index for filter (and sorting implicitly), and adds a javascript filter that only accepts friends who's name contains the word "foo" (case insensitive). It also uses paging with offset/limit on this result that is sorted by the index used (`age`).*
