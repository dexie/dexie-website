---
layout: docs
title: 'Table.bulkPut()'
---

### Syntax

```javascript
table.bulkPut(items, keys?)
```

### Parameters
<table>
  <tr>
    <td><code>items</code></td>
    <td>Array of objects to put</td>
  </tr>
  <tr>
    <td><code>keys</code> (optional)</td>
    <td>Array of primary keys that corresponds to given items array</td>
  </tr>
</table>

#### When to use the keys argument

* If your primary key is [inbound](/docs/inbound), you MUST NOT provide the `keys` argument.
* If primary key is non-[inbound](/docs/inbound) but auto-incremented, `keys` argument is optional.
* If primary key is non-[inbound](/docs/inbound) and non-auto-incremented, `keys` argument is compulsory.

```javascript
var db = new Dexie("test");
db.version(1).stores({
    tableWithInboundKeys: "id,x,y,z", // Don't provide "keys"
    tableWithAutoIncNonInbound: "++,x,y,x", // Optionally provide "keys"
    tableWithoutInboundKeys: ",x,y,z" // Always provide "keys"
});
```

### Return Value

[Promise&lt;LastKey&gt;](/docs/Promise/Promise) 

Returns with the resulting primary key of the object that was last in given array.

### Errors

If some operations fail, `bulkPut()` will ignore those failures but return a rejected Promise with a 
[Dexie.BulkError](/docs/DexieErrors/Dexie.BulkError) referencing failures. If caller does not catch that error, transaction will abort. If caller wants to ignore the failures, the `bulkPut()` operations must be caught. **NOTE: If you call `bulkPut()` outside a transaction scope and an error occur on one of the operations, the successful operations will still be persisted to DB! If this is not desired, surround your call to `bulkPut()` in a transaction and catch transaction's promise instead of the `bulkPut()` operation.**

### Remarks

Add all given objects to the store.

If you have a large number of objects to add to the object store, `bulkPut()` is faster than doing `put()` in a loop. Mainly because it only has to get called back for the last onsuccess of all indexedDB requests.

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
db.raindrops.bulkPut(drops).then(function(lastKey) {
    console.log("Done putting 100,000 raindrops all over the place");
    console.log("Last raindrop's id was: " + lastKey); // Will be 100000.
}).catch(Dexie.BulkError, function (e) {
    // Explicitely catching the bulkAdd() operation makes those successful
    // additions commit despite that there were errors.
    console.error ("Some raindrops did not succeed. However, " +
       100000-e.failures.length + " raindrops was added successfully");
});
```

### See Also

[Table.bulkAdd()](/docs/Table/Table.bulkAdd())

[Table.bulkDelete()](/docs/Table/Table.bulkDelete())

[Table.put()](/docs/Table/Table.put())
