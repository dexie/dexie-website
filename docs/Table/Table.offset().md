---
layout: docs
title: 'Table.offset()'
---

Returns a Collection (ordered by primary key), where the first N items in the object store are ignored.

### Syntax

```javascript
db.[table].offset(N)
```

### Parameters

<table>
<tr><td>N: Number</td><td>A positive (or zero) Number specifying how many records to ignore</td></tr>
</table>

### Return Value

[Collection](/docs/Collection/Collection)

### Remarks

Return a collection when the first N entries in the object store are ignored. If it is requested to skip the LAST N entires rather than the first, this method can be used in combination with the [Collection.reverse()](/docs/Collection/Collection.reverse()) method.

This method is equivalent to:

```javascript
db.[table].toCollection().offset(N)
```

or:

```javascript
db.[table].orderBy(':id').offset(N)
```

### Sample

This sample will sort friends by lastName and include the last 15th to 10th friend.

```javascript
db.friends.orderBy('lastName')
    .reverse()
    .offset(10)
    .limit(5)
    .toArray()
    .then(function (results) {
        console.log (JSON.stringify(results));
    });
```

### Limitations

In combination with the [or()](/docs/Collection/Collection.or()) method, the offset() method makes no sense since the sort order of the result will be undefined ([or()](/docs/Collection/Collection.or()) is working on multiple different indexes in parallel). Instead, use [sortBy()](/docs/Collection/Collection.sortBy()) and then slice the resulting array from requested offset.

### Performance Notes

If executed on simple queries, the native IDBCursor.advance() method will be used (fast execution). If advanced queries are used, the implementation have to execute a query to iterate all items and ignore N items using a JS filter.

#### Examples where offset() will be fast

```javascript
db.[table].offset(N)
db.[table].where(index).equals(value).offset(N)
db.[table].where(index).above(value).offset(N)
db.[table].where(index).below(value).offset(N)
db.[table].where(index).between(value).offset(N)
db.[table].where(index).startsWith(value).offset(N)
```

#### Examples where offset() will have to iterate the collection:

```javascript
db.[table].where(index).equalsIgnoreCase(value).offset(N)
db.[table].where(index).startsWithIgnoreCase(value).offset(N)
db.[table].where(index).anyOf(valueArray).offset(N)
db.[table].where(index).above(value).and(filterFunction).offset(N)
```

### See Also

#### [Collection.offset()](/docs/Collection/Collection.offset())

#### [Collection.limit()](/docs/Collection/Collection.limit())
