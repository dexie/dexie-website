---
layout: docs
title: 'Collection.each()'
---
### Syntax

```javascript
collection.each(callback)
```

### Parameters
<table>
  <tr>
    <td>callback: Function</td>
    <td><code>function (item, cursor) { }</code></td>
  </tr>
</table>

### Callback Parameters
<table>
  <tr>
    <td>item: Object</td>
    <td>Found object</td>
  </tr>
  <tr>
    <td>cursor: <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor"><code>IDBCursor</code></a></td>
    <td>The cursor of the object being iterated.</td>
  </tr>
</table>

### Return Value

[Promise](Promise)

### Remarks

When iteration finishes, the returned Promise will resolve with `undefined`, calling any [Promise.then()](Promise.then()) callback.

If the operation fails, the returned Promise will reject, calling any [Promise.catch()](Promise.catch()) callback.
