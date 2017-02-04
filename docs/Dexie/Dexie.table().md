---
layout: docs
title: 'Dexie.table()'
---

### Syntax

```javascript
db.table(storeName)
```

### Parameters
<table>
  <tr>
    <td>storeName : String</td>
    <td>The name of the store to retrieve</td>
  </tr>
</table>

### Return Value

[Table](Table)

### NOTES

In Dexie v1.3.x and below, it wasn't safe to store the result in a var and reuse it later. But since version 1.4.0, it is safe to do so. Ongoing transaction is now inspected at runtime (when table is used, not when returned from this method).
