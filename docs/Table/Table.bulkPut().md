---
layout: docs
title: 'Table.bulkPut()'
---

### Syntax

```javascript
table.bulkPut(items, keys?, options?)
```

### Parameters
<table>
  <tr>
    <td><code>items</code></td>
    <td>Array of objects to put</td>
  <tr>
    <td><code>keys</code> (optional)</td>
    <td>Array of primary keys that corresponds to given items array</td>
  </tr>
  <tr><td>options (optional)</td><td><i>Since 3.0.0-rc.2:</i><br/><br/><code>{allKeys?: boolean}</code> If specifying {allKeys: true} the return value will be an array of resulting primary keys instead of just the primary key of the last add. If the table use inbound keys, the options can be given as the second argument. API will know if the second argument represents the options or the keys array by type inspection.</td></tr>
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

If options argument is omitted, or options is {allKeys: false}, the return value is a promise resolving with the resulting primary key of the object that was last in given array:

[Promise&lt;LastKey&gt;](/docs/Promise/Promise)


*Since 3.0.0-rc.2*: If options argument is provided in second or third argument with {allKeys: true}, the return value is a promise resulting with an array of resulting primary keys. The resulting array will have the same length as given array of objects to put. Every position in given items array will correspond to the same position in the resulting array.

[Promise&lt;Key[]&gt;](/docs/Promise/Promise)


### Errors

If some operations fail, `bulkPut()` will ignore those failures and return a rejected Promise with a
[Dexie.BulkError](/docs/DexieErrors/Dexie.BulkError) referencing the failures. If the caller does not catch the error, the transaction will abort. If the caller wants to ignore the failures, the `bulkPut()` operations must be caught. **NOTE: If you call `bulkPut()` outside a transaction scope and an error occur on one of the operations, the successful operations will still be persisted to DB! If this is not desired, surround your call to `bulkPut()` in a transaction and catch transaction's promise instead of the `bulkPut()` operation.**

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
    drops.push({id: i, position: [Math.random(),Math.random(),Math.random()]})
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

[Table.bulkGet()](/docs/Table/Table.bulkGet())

[Table.bulkAdd()](/docs/Table/Table.bulkAdd())

[Table.bulkDelete()](/docs/Table/Table.bulkDelete())

[Table.put()](/docs/Table/Table.put())
