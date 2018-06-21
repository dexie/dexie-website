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
<tr><td>key</td><td>Key to compare with. The key MUST be a number, string, Date, ArrayBuffer, typed array (such as Uint8Array) instance or Array&lt;number | string | Date | ArrayBuffer | ArrayBufferView&gt;. Booleans, null, undefined and Objects are not accepted as valid keys. String comparisons are case sensitive.</td></tr>
</table>

### Return Value

[Collection](/docs/Collection/Collection)
