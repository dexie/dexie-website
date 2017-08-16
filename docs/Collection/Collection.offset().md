---
layout: docs
title: 'Collection.offset()'
---

### Syntax

```javascript
collection.offset(count)
```

### Parameters

<table>
<tr><td>count: Number</td><td>Number of entries to skip. Must be &gt;= 0.</td></tr>
</table>

### Return Value

This Collection instance (**this**)

### Remarks

Skips the first N entries from the resulting Collection. In case skipping the last N entries is requested, this method can be used in combination with the [Collection.reverse()](/dexie/Collection/Collection.reverse()) method.

### Sample

This sample will sort friends by lastName and include the last 15th to 10th friend.

```javascript
db.friends.orderBy('lastName').reverse().offset(10).limit(5);
```

### Limitations

In combination with the [or()](/dexie/Collection/Collection.or()) method, the offset() method makes no sense since the sort order of the result will be undefined ([or()](/dexie/Collection/Collection.or()) is working on multiple different indexes in parallell). Instead, use [sortBy()](/dexie/Collection/Collection.sortBy()) and then slice the resulting array from requested offset.

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
