---
layout: docs
title: 'WhereClause.equals()'
---

### Syntax

```javascript
table.where(indexOrPrimKey).equals(key)
```

### Parameters
<table>
<tr><td>indexOrPrimKey: String</td><td>Name of an index or primary key registered in <a href="/docs/Version/Version.stores()">Version.stores()</a></td></tr>
<tr><td>key</td><td>Key to compare with. The key MUST be a Number, String, Date or Array instance. Booleans are not accepted as valid keys</td></tr>
</table>

### Return Value

[Collection](/docs/Collection/Collection)
