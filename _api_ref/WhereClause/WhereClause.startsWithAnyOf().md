---
layout: docs
title: 'WhereClause.startsWithAnyOf()'
---

_Since v1.2_

### Syntax

```javascript
table.where(indexOrPrimKey).startsWithAnyOf(array) or
table.where(indexOrPrimKey).startsWithAnyOf(str1, str2, strN, ...)
```

### Parameters
<table>
<tr><td>indexOrPrimKey: String</td><td>Name of an index or primary key registered in <a href="/docs/Version/Version.stores()">Version.stores()</a></td></tr>
<tr><td>array</td><td>Array of prefixes (strings) to look for</td></tr>
<tr><td>str1, str2, strN</td><td>Prefixes (strings) to look for</td></tr>
</table>

### Return Value

[Collection](/docs/Collection/Collection)

