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

### Sample

See the sample in [Table.offset()](/docs/Table/Table.offset()).

### See Also

[Collection.sortBy()](/docs/Collection/Collection.sortBy())
