---
layout: docs
title: 'Collection.last()'
---

### Syntax

```javascript
collection.last(callback)
```

### Parameters

<table>
<tr><td>callback: Function</td><td>function (item) { }</td><td><i>optional</i></td></tr>
</table>

### Callback Parameters

<table>
<tr><td>item: Object</td><td>Last item in the collection if any. Otherwise <i>undefined</i></td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Remarks

If callback is omitted and operation succeeds, returned Promise will resolve with the result of the operation, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If callback is specified and operation succeeds, given callback will be called and the returned Promise will resolve with the return value of given callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.
