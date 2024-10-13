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
<tr><td>keys (optional)</td><td>Array of primary keys that corresponds to given items array</td></tr>
<tr><td>options (optional)</td><td><i>Since 3.0.0-rc.2:</i><br/><br/><code>{allKeys?: boolean}</code> If specifying {allKeys: true} the return value will be an array of resulting primary keys instead of just the primary key of the last add. If the table use inbound keys, the options can be given as the second argument. API will know if the second argument represents the options or the keys array by type inspection.</td></tr>
</table>

#### When to use the keys argument

- If your primary key is [inbound](/docs/inbound), you MUST NOT provide the `keys` argument.
- If primary key is non-[inbound](/docs/inbound) but auto-incremented, `keys` argument is optional.
- If primary key is non-[inbound](/docs/inbound) and non-auto-incremented, `keys` argument is compulsory.

```javascript
var db = new Dexie('test');
db.version(1).stores({
  tableWithInboundKeys: 'id,x,y,z', // Don't provide "keys"
  tableWithAutoIncNonInbound: '++,x,y,x', // Optionally provide "keys"
  tableWithoutInboundKeys: ',x,y,z' // Always provide "keys"
});
```

### Return Value

If options argument is omitted, or options is {allKeys: false}, the return value is a promise resolving with the resulting primary key of the object that was last in given array:

[Promise&lt;LastKey&gt;](/docs/Promise/Promise)

_Since 3.0.0-rc.2_: If options argument is provided in second or thirs argument with {allKeys: true}, the return value is a promise resulting with an array of resulting primary keys. The resulting array will have the same length as given array of objects to add.

[Promise&lt;Key[]&gt;](/docs/Promise/Promise)

### Errors

If some operations fail, bulkAdd will ignore those failures but return a rejected Promise with a
[Dexie.BulkError](/docs/DexieErrors/Dexie.BulkError) referencing failures. If caller does not catch that error, transaction will abort. If caller wants to ignore the fails, the bulkAdd() operations must be caught. **NOTE: If you call bulkAdd() outside a transaction scope and an error occur on one of the operations, the successful operations will still be persisted to DB! If this is not desired, surround your call to `bulkAdd()` in a transaction and catch the transaction's promise instead of the `bulkAdd()` operation.**

### Remarks

Add all given objects to the store.

If you have a large number of objects to add to the object store, bulkAdd() is a little faster than doing add() in a loop.

If you do bulkAdd () within a transaction and don't catch the operation explicitly, the entire transaction will fail and roll back if any one item has an existing primary key. Catching the bulkAdd () will make sure any successful operation succeeds while failed operations are just ignored.

### Difference between bulkPut() and bulkAdd()

bulkAdd() will fail to add any item with same primary key whilst bulkPut () will succeed and update those records as well as the new ones.

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
db.raindrops.bulkAdd(drops).then(() => {
    console.log("Done adding 100,000 raindrops all over the place");
}).catch(error => {
    if (error.name === "BulkError") {
        // Explicitly catching the bulkAdd() operation makes those successful
        // additions commit despite that there were errors.
        console.error ("Some raindrops did not succeed. However, " +
        100000-e.failures.length + " raindrops was added successfully");
    } else {
        throw error; // we're only handling BulkError specifically here...
    }
});

```

### See Also

[Table.bulkGet()](</docs/Table/Table.bulkGet()>)

[Table.bulkPut()](</docs/Table/Table.bulkPut()>)

[Table.bulkDelete()](</docs/Table/Table.bulkDelete()>)

[Table.add()](</docs/Table/Table.add()>)
