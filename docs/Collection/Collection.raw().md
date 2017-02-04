---
layout: docs
title: 'Collection.raw()'
---
### Syntax

    collection.raw()

### Return Value

This Collection instance (**this**)

### Remarks

Makes the resulting operation ignore any subscriber to [Table.hook('reading')](Table.hook('reading')). For example, it will not map objects to their [mapped class](Table.mapToClass()).
