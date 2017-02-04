---
layout: docs
title: 'WhereClause.equals()'
---
### Syntax

    table.where(indexOrPrimKey).equals(key)

### Parameters
<table>
<tr><td>indexOrPrimKey: String</td><td>Name of an index or primary key registered in <a href="Version.stores()">Version.stores()</a></td></tr>
<tr><td>key</td><td>Key to compare with. The key MUST be a Number, String, Date or Array instance. Booleans are not accepted as valid keys</td></tr>
</table>

### Return Value

[Collection](Collection)
