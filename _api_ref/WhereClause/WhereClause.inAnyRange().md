---
layout: docs
title: 'WhereClause.inAnyRange()'
---

*Since v1.3.0*

### Syntax

```javascript
table.where(indexOrPrimKey).inAnyRange(ranges, options)
```

### Parameters

<table>
<tr><td>indexOrPrimKey: String</td><td>Name of an index or primary key registered in <a href="/docs/Version/Version.stores()">Version.stores()</a></td></tr>
<tr><td>ranges</td><td>Array of Arrays defining ranges to search [[lowerBound, upperBound],...]</td></tr>
<tr><td>options</td><td>Options of how to tread range starts and ends</td></tr>
<tr><td>options.includeLowers</td><td>Whether lowerBound should be included or not. Default: true. Specify 'false' explicitly if lowerBound should NOT be included in the results.</td></tr>
<tr><td>options.includeUppers</td><td>Whether upperBound should be included or not. Default: false</td></tr>
</table>

### Return Value

[Collection](/docs/Collection/Collection)

### Remarks

Returns a collection where index is within any of the given ranges.

### Sample

```javascript
// Give children and elders a rebate of 50%:
db.customers.where('age')
  .inAnyRange([[0, 18], [65, Infinity]])
  .modify({Rebate: 1/2});
```
