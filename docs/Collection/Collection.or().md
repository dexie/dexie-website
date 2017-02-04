---
layout: docs
title: 'Collection.or()'
---
### Syntax

    collection.or(indexOrPrimaryKey)

### Parameters
<table>
<tr><td>indexOrPrimaryKey: String</td><td>Name of an index or primary key registered in <a href="Version.stores()">Version.stores()</a></td></tr>
</table>

### Return Value

[WhereClause](WhereClause)

### Sample

     db.friends.where("name").equalsIgnoreCase("david").or("shoeSize").above(40)
     .sortBy("shoeSize")

### Limitations

The sort order of the resulting collection will be undefined since the collection works on multiple indexes. To canonicalize the sort order, use the [Collection.sortBy()](Collection.sortBy()) method.

### Implementation Details

This is implemented using parallell query execution and duplicate removals. For details, read [this article](http://www.codeproject.com/Articles/744986/How-to-do-some-magic-with-indexedDB)
