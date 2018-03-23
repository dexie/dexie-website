---
layout: docs
title: 'Collection.eachKey()'
---

### Syntax

```javascript
collection.eachKey(callback)
```

### Parameters

<table>
<tr><td>callback: Function</td><td>function (key, cursor) { }</td></tr>
</table>

### Callback Parameters

<table>
<tr><td>key: Object</td><td>Found key</td></tr>
<tr><td>cursor: <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor">IDBCursor</a></td><td>The cursor of the object being iterated.</td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Remarks

When iteration finish, returned Promise will resolve with _undefined_, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.

### See Also

[Collection.keys()](/docs/Collection/Collection.keys())

[Collection.uniqueKeys()](/docs/Collection/Collection.uniqueKeys())
