---
layout: docs
title: 'WhereClause.startsWithIgnoreCase()'
---

### Syntax

```javascript
table.where(indexOrPrimKey).startsWithIgnoreCase(prefix)
```

### Parameters

<table>
<tr><td>indexOrPrimKey: String</td><td>Name of an index or primary key registered in <a href="/docs/Version/Version.stores()">Version.stores()</a></td></tr>
<tr><td>prefix</td><td>Prefix to look for. Must be a string</td></tr>
</table>

### Return Value

[Collection](/docs/Collection/Collection)

### Implementation Details

This method is an extension to the standard indexedDB API and is implemented using an algorithm invented by [David Fahlander](https://github.com/dfahlander/). For more details, please read [this article](http://www.codeproject.com/Articles/744986/How-to-do-some-magic-with-indexedDB)
