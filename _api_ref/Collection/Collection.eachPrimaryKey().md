---
layout: docs
title: 'Collection.eachPrimaryKey()'
---
*Since 1.4.0*

### Syntax

```javascript
collection.eachPrimaryKey(callback)
```

### Parameters

<table>
<tr><td>callback: Function</td><td>function (primaryKey) { }</td></tr>
</table>

### Callback Parameters

<table>
<tr><td>key: string | Date | number | Array</td><td>Found key</td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Remarks

When iteration finish, returned Promise will resolve with _undefined_, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If operation fails, returned promise will be rejected, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.

### Sample

```javascript
db.friends.orderBy('firstName').eachPrimaryKey(function (primaryKey) {
    // This callback will be called in the firstName order and provide
    // the primary key of the object it refers to.
});
```
