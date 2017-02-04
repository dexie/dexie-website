---
layout: docs
title: 'Collection.toArray()'
---

### Syntax

```javascript
collection.toArray(callback)
```

### Parameters

<table>
<tr><td>callback: Function</td><td>function (array) { }</td><td><i>optional</i></td></tr>
</table>

### Callback Parameters

<table>
<tr><td>array: Array</td><td>Array containing the found objects</td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Remarks

If callback is omitted and operation succeeds, returned Promise will resolve with the result of the operation, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If callback is specified and operation succeeds, given callback will be called and the returned Promise will resolve with the return value of given callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.
