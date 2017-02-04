---
layout: docs
title: 'Table.limit()'
---

Returns a Collection limited to N items.

### Syntax

```javascript
db.[table].limit(N)
```

### Return Value

[Collection](/docs/Collection/Collection)

### Remarks

This method is equivalent to:

```javascript
db.[table].toCollection().limit(N)
```

or:

```javascript
db.[table].orderBy(':id').limit(N)
```

### See Also

[Collection.limit()](/docs/Collection/Collection.limit())

[Table.offset()](/docs/Table/Table.offset())
