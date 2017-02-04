---
layout: docs
title: 'Table.limit()'
---

Returns a Collection limited to N items.

### Syntax

    db.[table].limit(N)

### Return Value

[Collection](Collection)

### Remarks

This method is equivalent to:

    db.[table].toCollection().limit(N)

or:

    db.[table].orderBy(':id').limit(N)

### See Also

#### [Collection.limit()](Collection.limit())

#### [Table.offset()](Table.offset())
