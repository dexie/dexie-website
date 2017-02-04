---
layout: docs
title: 'Table.add()'
---

Adds an object to the object store.

### Syntax

    table.add(item, [key])

### Parameters
<table>
<tr><td>item</td><td>Object to add</td><td></td></tr>
<tr><td>key</td><td>Primary key</td><td><i>optional</i></td></tr>
</table>

### Return Value

[Promise](Promise)

### Remarks

Add given object to store. If an object with the same primary key already exist, the operation will fail and returned promise [catch()](Promise) callback will be called with the error object. If the operation succeeds, the returned promise [resolve()](Promise) callback receives the result of the `add` request on the object store, the id of the inserted object.

### See Also
[Table.put()](Table.put())
