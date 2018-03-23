---
layout: docs
title: 'Collection.count()'
---
### Syntax

```javascript
collection.count(callback)
```

### Parameters
<table>
  <tr>
    <td>callback: Function</td>
    <td><code>function (count) { }</code></td>
    <td><i>optional</i></td>
  </tr>
</table>

### Callback Parameters
<table>
  <tr>
    <td>count: Number</td>
    <td>Number of items in the collection</td>
  </tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Remarks

If callback is omitted and operation succeeds, returned Promise will resolve with the result of the operation, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If callback is specified and operation succeeds, given callback will be called and the returned Promise will resolve with the return value of given callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.

### Performance Notes

If executed on simple queries, the native IndexedDB ObjectStore [`count()`](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/count) method will be called (fast execution). If advanced queries are used, the implementation has to execute a query to iterate all items and count them manually.

#### Examples where `count()` will be fast

```javascript
db.[table].count()
db.[table].where(index).equals(value).count()
db.[table].where(index).above(value).count()
db.[table].where(index).below(value).count()
db.[table].where(index).between(a,b).count()
db.[table].where(index).startsWith(value).count()
```

The reason it is fast in above samples is that they map to basic [IDBKeyRange](https://developer.mozilla.org/en-US/docs/Web/API/IDBKeyRange) methods [only()](https://developer.mozilla.org/en-US/docs/Web/API/IDBKeyRange/only), [lowerBound()](https://developer.mozilla.org/en-US/docs/Web/API/IDBKeyRange/lowerBound), [upperBound()](https://developer.mozilla.org/en-US/docs/Web/API/IDBKeyRange/upperBound), and [bound()](https://developer.mozilla.org/en-US/docs/Web/API/IDBKeyRange/bound).
 
#### Examples where `count()` will have to count manually:

```javascript
db.[table].where(index).equalsIgnoreCase(value).count()
db.[table].where(index).startsWithIgnoreCase(value).count()
db.[table].where(index).anyOf(valueArray).count()
db.[table].where(index).above(value).and(filterFunction).count()
db.[table].where(index1).above(value1).or(index2).below(value2).count()
```
