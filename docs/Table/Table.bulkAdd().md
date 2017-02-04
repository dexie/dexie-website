---
layout: docs
title: 'Table.bulkAdd()'
---

### Syntax

    table.bulkAdd(items, keys?)

### Parameters
<table>
<tr><td>items</td><td>Array of objects to add</td><td></td></tr>
<tr><td>keys (optional)</td><td>Array of primary keys that corresponds to given items array</td><td></td></tr>
</table>

#### When to use the keys argument

* If your primary key is [inbound](inbound), you MUST NOT provide the `keys` argument.
* If primary key is non-[inbound](inbound) but auto-incremented, `keys` argument is optional.
* If primary key is non-[inbound](inbound) and non-auto-incremented, `keys` argument is compulsory.

```javascript
var db = new Dexie("test");
db.version(1).stores({
    tableWithInboundKeys: "id,x,y,z", // Don't provide "keys"
    tableWithAutoIncNonInbound: "++,x,y,x", // Optionally provide "keys"
    tableWithoutInboundKeys: ",x,y,z" // Always provide "keys"
});
```

### Return Value

[Promise<LastKey>](Promise) 

Returns with the resulting primary key of the object that was last in given array.

### Errors
If some operations fail, bulkAdd will ignore those failures but return a rejected Promise with a 
[Dexie.BulkError](Dexie.BulkError) referencing failures. If caller does not catch that error, transaction will abort. If caller wants to ignore the failes, the bulkAdd() operations must be catched. **NOTE: If you call bulkAdd() outside a transaction scope and an error occur on one of the operations, the successful operations will still be persisted to DB! If this is not desired, surround your call to bulkAdd() in a transaction and do not catch the bulkAdd() operation but just the transaction promise!**

### Remarks

Add all given objects to the store.

If you have a large number of objects to add to the object store, bulkAdd() is a little faster than doing add() in a loop.

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
    // Explicitely catching the bulkAdd() operation makes those successful
    // additions commit despite that there were errors.
    console.error ("Some raindrops did not succeed. However, " +
       100000-e.failures.length + " raindrops was added successfully");
});

```
### See Also
[Table.bulkPut()](Table.bulkPut())

[Table.bulkDelete()](Table.bulkDelete())

[Table.add()](Table.add())


