---
layout: docs
title: 'Table'
---

The Table class represents an IDBObjectStore.

### Properties

#### [name](Table.name)
The name of the object store represented by this Table instance.

#### [schema](Table.schema)
The table schema of this object store.

### Events

#### [hook('creating')](Table.hook('creating'))
Atomic CRUD hook called when object is about to be created in db.

#### [hook('reading')](Table.hook('reading'))
Atomic CRUD hook called when object has been read from db and is about to be delivered to caller.

#### [hook('updating')](Table.hook('updating'))
Atomic CRUD hook called when object is about to be modified in db.

#### [hook('deleting')](Table.hook('deleting'))
Atomic CRUD hook called when object is about to be deleted from db.

### Methods

#### [add()](Table.add())
Insert an object into store.

#### [bulkAdd()](Table.bulkAdd())
Same as add() but takes array arguments and is optimized for adding a large number of objects.

#### [bulkDelete()](Table.bulkDelete())
Same as delete() but takes and array of keys and is optimized for deleting a large number of objects.

#### [bulkPut()](Table.bulkPut())
Same as put() but takes array arguments and is optimized for putting a large number of objects.

#### [clear()](Table.clear())
Clear all objects in store.

#### [count()](Table.count())
Count all objects.

#### [defineClass()](Table.defineClass())
Define a javascript constructor function and map to this table.

#### [delete()](Table.delete())
Delete an object from store.

#### [each()](Table.each())
Iterate all objects in store.

#### [filter()](Table.filter())
Apply javascript filter on all items in the object store

#### [get()](Table.get())
Retrieve object by primary key.

#### [limit()](Table.limit())
Return a Collection ordered by primary key, limited to N items.

#### [mapToClass()](Table.mapToClass())
Map this table to javascript constructor function.

#### [orderBy()](Table.orderBy())
Returns a Collection instance ordered by given index.

#### [offset()](Table.offset())
Return a Collection ordered by primary key, where the first N items in the table are ignored.

#### [put()](Table.put())
Replace or insert object.

#### [reverse()](Table.reverse())
Returns a Collection instance with reversed order of the primary key.

#### [toArray()](Table.toArray())
Get an array containing all objects in store.

#### [toCollection()](Table.toCollection())
Get a [Collection](Collection) containing all objects in store.

#### [update()](Table.update())
Apply given changes to an existing object.

#### [where()](Table.where())
Retrieve objects using a query.

### See Also
#### [Collection](Collection)
