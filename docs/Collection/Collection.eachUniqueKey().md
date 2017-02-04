---
layout: docs
title: 'Collection.eachUniqueKey()'
---
### Syntax

    collection.eachUniqueKey(callback)

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

[Promise](Promise)

### Remarks

When iteration finish, returned Promise will resolve with _undefined_, calling any [Promise.then()](Promise.then()) callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](Promise.catch()) callback.

### Sample

    db.friends.orderBy('firstName').eachUniqueKey(function (firstName) {
        // This callback will be called once for each unique firstName in DB no matter
        // if having multiple friends with same name.
    });
