---
layout: docs
title: 'Collection.desc()'
---
### Deprecated
Method is replaced with the [reverse()](Collection.reverse()) method but will remain a few versions ahead.

### Syntax

    collection.desc()

### Return Value

This Collection instance (**this**)

### Remarks

No matter if using [sortBy()](Collection.sortBy()) or natural sort order ([orderBy](Table.orderBy()) or a [where()](Table.where()) clause), this method will reverse the sort order of the collection.

If called twice, the sort order will reset to ascending again.
