---
layout: docs
title: 'WhereClause.notEqual()'
---

_Since v1.2_

### Syntax

```javascript
table.where(indexOrPrimKey).notEqual(key)
```

### Parameters
<table>
<tr><td>indexOrPrimKey: String</td><td>Name of an index or primary key registered in <a href="/docs/Version/Version.stores()">Version.stores()</a></td></tr>
<tr><td>key</td><td>Key to compare with. The key MUST be a Number, String, Date or Array instance. Booleans are not accepted as valid keys</td></tr>
</table>

### Return Value

[Collection](/docs/Collection/Collection)

### Remarks

Queries the collection for all valid values that does not match given value. Note that you will only find values that are valid indexedDB keys.

Given the following data:

```
{ id: 1, shoeSize: 9 }
{ id: 2, shoeSize: 10 }
{ id: 3, shoeSize: 11 }
{ id: 4 }
{ id: 5, shoeSize: null }
{ id: 6, shoeSize: "abc" }
{ id: 7, shoeSize: false }
{ id: 8, shoeSize: ["a","b","c"]}
```
And the following query:

```javascript
db.people.where('shoeSize').notEqual(10).each(function(x) {
    console.log("Found: " + JSON.stringify(x));
});
```
We get the following result:

```
Found: "{id:1,shoeSize:9}"
Found: "{id:3,shoeSize:11}"
Found: "{id:6,shoeSize:\"abc\"}"
Found: "{id:8,shoeSize:[\"a\",\"b\",\"c\"]}"
```

Note that number 4 was not included in the result because it didn't have a valid `shoeSize` key so it's not indexed. A valid key is a key of type string, number, Date or Array<string \| number \| Date>. Booleans, null and undefined are NOT valid indexedDB keys.

