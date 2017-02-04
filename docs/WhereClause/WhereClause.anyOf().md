---
layout: docs
title: 'WhereClause.anyOf()'
---

### Syntax

```javascript
table.where(indexOrPrimKey).anyOf(array) or
table.where(indexOrPrimKey).anyOf(key1, key2, keyN, ...)
```

### Parameters
<table>
<tr><td>indexOrPrimKey: String</td><td>Name of an index or primary key registered in <a href="/docs/Version/Version.stores()">Version.stores()</a></td></tr>
<tr><td>array</td><td>Array of keys to look for</td></tr>
<tr><td>key1, key2, keyN</td><td>Keys to look for</td></tr>
</table>

### Return Value

[Collection](/docs/Collection/Collection)

### Implementation Details

This method is an extension to the standard indexedDB API and is implemented using an algorithm invented by [David Fahlander](https://github.com/dfahlander/). For more details, please read [this article](http://www.codeproject.com/Articles/744986/How-to-do-some-magic-with-indexedDB)
