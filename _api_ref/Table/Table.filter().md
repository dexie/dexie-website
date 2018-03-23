---
layout: docs
title: 'Table.filter()'
---

Apply javascript filter on all items in the object store

### Syntax

```javascript
table.filter(filterFunction)
```

### Parameters

<table>
<tr><td>filterFunction: Function</td><td>function (value) { return true/false; }</td></tr>
</table>

### Remarks

Returns a Collection instance that will iterate entire object store and calls given filter function for each item when calling any of the executing methods on the Collection, such as [toArray()](/docs/Collection/Collection.toArray()), [each()](/docs/Collection/Collection.each()), [keys()](/docs/Collection/Collection.keys()), [uniqueKeys()](/docs/Collection/Collection.uniqueKeys()) and [sortBy()](/docs/Collection/Collection.sortBy()).

### Return Value

[Collection](/docs/Collection/Collection)
