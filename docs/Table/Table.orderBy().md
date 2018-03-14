---
layout: docs
title: 'Table.orderBy()'
---

Return a collection of all items in table ordered by given index.

### Syntax

```javascript
table.orderBy(index)
```

### Parameters

<table>
  <tr>
    <td>index: String</td>
    <td>The primary key or index to use for sorting. The special string ":id" will always order by the primary key.</td>
  </tr>
</table>

### Return Value

[Collection](/docs/Collection/Collection)

### Remarks

Returns an unfiltered collection sorted by the index or primary key given by `index`. Note that `index` can only be an indexed property or the primary key. If you want to sort by an un-indexed property, then use [Collection.sortBy()](/docs/Collection/Collection.sortBy()) instead.

### OrderBy on Collections
In current version of Dexie (v2.0), it is not possible to do:

```javascript
db.friends
  .where('age').above(25)
  .orderBy('name')
```
... and there is a simple reason for that: No database can do this query easily as it can only operate on one btree at a time. However, most databases yet supports, but involving set matching of primary keys and a full index scans on the ordered query.

Even though current version of Dexie (v2.0) does not have orderBy() on Collections, the feature will be introduced in a future version, and can already be accomplished without using sortBy() - see [this sample](http://dexie.org/docs/Collection/Collection.offset()#paged-or-queries).

### Sample

See the sample in [Table.offset()](/docs/Table/Table.offset()).

### See Also

[Collection.sortBy()](/docs/Collection/Collection.sortBy())

[A better paging approach](http://dexie.org/docs/Collection/Collection.offset()#a-better-paging-approach)


