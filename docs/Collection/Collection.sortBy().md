---
layout: docs
title: 'Collection.sortBy()'
---

Same as [toArray()](/docs/Collection/Collection.toArray()) but with manual sorting applied to the array. Similar to [Table.orderBy()](/docs/Table/Table.orderBy()) but does sorting on the resulting array rather than letting the backend implementation do the sorting.

### Syntax

```javascript
collection.sortBy(keyPath, callback?)
```

### Parameters

<table>
<tr><td>keyPath: String</td><td>Name of a property or sub property to use for sorting.</td></tr>
<tr><td>callback: Function</td><td>function (array) { }</td><td><i>optional</i></td></tr>
</table>

### Callback Parameters

<table>
<tr><td>array: Array</td><td>Array containing the found objects</td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Remarks

Items in a Collection is naturally sorted by the index or primary key that was used in the [where()](/docs/Table/Table.where()) clause. However, if you need sorting on another property than the index, you can use this method to do so. Also, if [Collection.or()](/docs/Collection/Collection.or()) has been used, the Collection is no longer sorted unless you use this method.

If callback is omitted and operation succeeds, returned Promise will resolve with the result of the operation, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If callback is specified and operation succeeds, given callback will be called and the returned Promise will resolve with the return value of given callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.

To sort in descending order, use [Collection.reverse()](/docs/Collection/Collection.reverse()) on the collection before calling sortBy().

```javascript
// Query by age but sort by name in descending order:
db.friends
  .where('age')
  .above(25)
  .reverse() 
  .sortBy('name');
```

### See Also

[Table.orderBy()](/docs/Table/Table.orderBy())

[A better paging approach](https://dexie.org/docs/Collection/Collection.offset()#a-better-paging-approach)

