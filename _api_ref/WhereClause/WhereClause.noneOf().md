---
layout: docs
title: 'WhereClause.noneOf()'
---

### Syntax

```javascript
table.where(indexOrPrimKey).noneOf([key1, key2, keyN, ...])
```

### Parameters
<table>
<tr><td>indexOrPrimKey: String</td><td>Name of an index or primary key registered in <a href="/docs/Version/Version.stores()">Version.stores()</a></td></tr>
<tr><td>key</td><td>Array of keys to compare with. Each key MUST be a Number, String, Date or Array instance. Booleans are not accepted as valid keys</td></tr>
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
db.people.where('shoeSize').noneOf([10,11]).each(function(x) {
    console.log("Found: " + JSON.stringify(x));
});
```
We get the following result:

```
Found: "{id:1,shoeSize:9}"
Found: "{id:6,shoeSize:\"abc\"}"
Found: "{id:8,shoeSize:[\"a\",\"b\",\"c\"]}"
```
Note that id 4, 5 and 7 wasn't included in the result. This is because indexedDB uses sparse indexes and will not index records where a key is invalid. A valid key is a key of type string, number, Date or Array<string | number | Date>.

### Practical Limitations

As exemplified above, WhereClause.noneOf() and [WhereClause.notEqual()](/docs/WhereClause/WhereClause.notEqual()) will NOT find records with invalid keys, such as null, booleans, undefined etc. It can only search keys that indexedDB supports: string, number, Date or Array<string \| number \| Date>.
