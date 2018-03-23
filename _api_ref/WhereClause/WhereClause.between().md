---
layout: docs
title: 'WhereClause.between()'
---

### Syntax

```javascript
table.where(indexOrPrimKey)
  .between(lowerBound, upperBound, includeLower, includeUpper)
```

### Parameters
<table>
<tr><td>indexOrPrimKey: String</td><td>Name of an index or primary key registered in <a href="/docs/Version/Version.stores()">Version.stores()</a></td></tr>
<tr><td>lowerBound</td><td>Lower bound</td></tr>
<tr><td>upperBound</td><td>Upper bound</td></tr>
<tr><td>includeLower</td><td>Whether lowerBound should be included or not. Default: true. Specify 'false' explicitly if lowerBound should NOT be included in the results.</td></tr>
<tr><td>includeUpper</td><td>Whether upperBound should be included or not. Default: false</td></tr>
</table>

### Return Value

[Collection](/docs/Collection/Collection)
