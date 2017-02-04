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

This method is identical to [Collection.and()](Collection.and())

### Sample

```javascript
db.friends.orderBy('age').filter(function (friend) {
    return friend.name === "Foo";
});
```
