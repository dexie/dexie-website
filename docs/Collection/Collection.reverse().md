---
layout: docs
title: 'Collection.reverse()'
---
### Syntax

    collection.reverse()

### Return Value

This Collection instance (**this**)

### Remarks

No matter if using [sortBy()](Collection.sortBy()) or natural sort order ([orderBy](Table.orderBy()) or a [where()](Table.where()) clause), this method will reverse the sort order of the collection.

If called twice, the sort order will reset to ascending again.

reverse() replaces deprecated [desc()](Collection.desc()) method. Behaviour is equivalent to the [desc()](Collection.desc()) method.

