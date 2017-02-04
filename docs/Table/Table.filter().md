---
layout: docs
title: 'Table.filter()'
---

Apply javascript filter on all items in the object store

### Syntax

    table.filter(filterFunction)

### Parameters
<table>
<tr><td>filterFunction: Function</td><td>function (value) { return true/false; }</td></tr>
</table>

### Remarks
Returns a Collection instance that will iterate entire object store and calls given filter function for each item when calling any of the executing methods on the Collection, such as [toArray()](Collection.toArray()), [each()](Collection.each()), [keys()](Collection.keys()), [uniqueKeys()](Collection.uniqueKeys()) and [sortBy()](Collection.sortBy()).

### Return Value

[Collection](Collection)

