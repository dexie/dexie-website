---
layout: docs
title: 'Table.bulkAdd()'
---

### Syntax

```typescript
table.bulkAdd(items, keys?, options?);
```

### Parameters

<table>
<tr><td>items</td><td>Array of objects to add</td></tr>
<tr><td>keys (optional)</td><td>Array of primary keys that corresponds to the given array of items</td></tr>
<tr><td>options (optional)</td><td><i>Since 3.0.0-rc.2:</i><br/><br/><code>{allKeys?: boolean}</code> If specifying <code>{allKeys: true}</code>, then the return value will be an array of resulting primary keys instead of just the primary key of the last item added. If the table uses inbound keys, then the options can be given as the second argument. The API will know whether the second argument represents the options or the keys array by type inspection.</td></tr>
</table>

#### When to use the keys argument

* If the primary key is [inbound](/docs/inbound), then you MUST NOT provide the `keys` argument.
* If the primary key is non-[inbound](/docs/inbound) but auto-incremented, then the `keys` argument is optional.
* If the primary key is non-[inbound](/docs/inbound) and non-auto-incremented, then the `keys` argument is compulsory.

```javascript
var db = new Dexie("test");
db.version(1).stores({
    tableWithInboundKeys: "id,x,y,z", // Don't provide "keys"
    tableWithAutoIncNonInbound: "++,x,y,x", // Optionally provide "keys"
    tableWithoutInboundKeys: ",x,y,z" // Always provide "keys"
});
```

### Return Value

If the options argument is omitted, or options is `{allKeys: false}`, then the return value is a promise resolving with the resulting primary key of the object that was last added from the given array:

[Promise&lt;LastKey&gt;](/docs/Promise/Promise)


*Since 3.0.0-rc.2*:

If the options argument is provided as the second or third argument with `{allKeys: true}`, then the return value is a promise resolving with an array of the resulting primary keys. The resulting array will have the same length as the given array of objects to be added.

[Promise&lt;Key[]&gt;](/docs/Promise/Promise)


### Errors
If some operations fail, then `bulkAdd()` will ignore those failures and return a rejected Promise with a
[Dexie.BulkError](/docs/DexieErrors/Dexie.BulkError) referencing the failures. If a caller does not catch that error, then the transaction will abort. If a caller wants to ignore the failures, then the `bulkAdd()` operation must be caught.

>**NOTE**
>
> If `bulkAdd()` is called outside of a transaction scope and an error occurs for one of the operations, then the successful operations will still be persisted to the database! If this is not desired, then surround the call to `bulkAdd()` in a transaction and catch the transaction's promise instead of the `bulkAdd()` operation.

### Remarks

Add all given objects to the store.

If you have a large number of objects to add to the object store, then `bulkAdd()` is a little faster than calling `add()` in a loop.

If you call `bulkAdd()` within a transaction and don't catch the operation explicitly, then the entire transaction will fail and roll back if any item has an existing primary key. Catching `bulkAdd()` will make sure that successful operations will succeed while failed operations are just ignored.

### Difference between bulkPut() and bulkAdd()

`bulkAdd()` will fail to add any item with a primary key that already exists in the store, whereas `bulkPut()` will succeed and update those records that already have a primary key that exists as well as new records (i.e. those records that have a primary key which does not exist in the store).

### Sample

```javascript
var db = new Dexie("test");
db.version(1).stores({
    raindrops: 'id,position'
});
var drops = [];
for (var i=0;i<100000;++i) {
    drops.push({id: i, position: [Math.random(),Math.random(),Math.random()]}),
}
db.raindrops.bulkAdd(drops).then(function(lastKey) {
    console.log("Done adding 100,000 raindrops all over the place");
    console.log("Last raindrop's id was: " + lastKey); // Will be 100000.
}).catch(Dexie.BulkError, function (e) {
    // Explicitly catching the bulkAdd() operation makes those successful
    // additions commit despite that there were errors.
    console.error ("Some raindrops did not succeed. However, " +
       100000-e.failures.length + " raindrops was added successfully");
});

```
### See Also
[Table.bulkGet()](/docs/Table/Table.bulkGet())

[Table.bulkPut()](/docs/Table/Table.bulkPut())

[Table.bulkDelete()](/docs/Table/Table.bulkDelete())

[Table.add()](/docs/Table/Table.add())
