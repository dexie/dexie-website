---
layout: docs
title: 'Table'
---

The Table class represents an IDBObjectStore.

### Properties

#### [name](/docs/Table/Table.name)
The name of the object store represented by this Table instance.

#### [schema](/docs/Table/Table.schema)
The table schema of this object store.

### Events

#### [hook('creating')](/docs/Table/Table.hook('creating'))
Atomic CRUD hook called when object is about to be created in db.

#### [hook('reading')](/docs/Table/Table.hook('reading'))
Atomic CRUD hook called when object has been read from db and is about to be delivered to caller.

#### [hook('updating')](/docs/Table/Table.hook('updating'))
Atomic CRUD hook called when object is about to be modified in db.

#### [hook('deleting')](/docs/Table/Table.hook('deleting'))
Atomic CRUD hook called when object is about to be deleted from db.

### Methods

#### [add()](/docs/Table/Table.add())
Insert an object into store.

#### [bulkAdd()](/docs/Table/Table.bulkAdd())
Same as add() but takes array arguments and is optimized for adding a large number of objects.

#### [bulkDelete()](/docs/Table/Table.bulkDelete())
Same as delete() but takes and array of keys and is optimized for deleting a large number of objects.

#### [bulkPut()](/docs/Table/Table.bulkPut())
Same as put() but takes array arguments and is optimized for putting a large number of objects.

#### [clear()](/docs/Table/Table.clear())
Clear all objects in store.

#### [count()](/docs/Table/Table.count())
Count all objects.

#### [defineClass()](/docs/Table/Table.defineClass())
Define a javascript constructor function and map to this table.

#### [delete()](/docs/Table/Table.delete())
Delete an object from store.

#### [each()](/docs/Table/Table.each())
Iterate all objects in store.

#### [filter()](/docs/Table/Table.filter())
Apply javascript filter on all items in the object store

#### [get()](/docs/Table/Table.get())
Retrieve object by primary key.

#### [limit()](/docs/Table/Table.limit())
Return a Collection ordered by primary key, limited to N items.

#### [mapToClass()](/docs/Table/Table.mapToClass())
Map this table to javascript constructor function.

#### [orderBy()](/docs/Table/Table.orderBy())
Returns a Collection instance ordered by given index.

#### [offset()](/docs/Table/Table.offset())
Return a Collection ordered by primary key, where the first N items in the table are ignored.

#### [put()](/docs/Table/Table.put())
Replace or insert object.

#### [reverse()](/docs/Table/Table.reverse())
Returns a Collection instance with reversed order of the primary key.

#### [toArray()](/docs/Table/Table.toArray())
Get an array containing all objects in store.

#### [toCollection()](/docs/Table/Table.toCollection())
Get a [Collection](/docs/Collection/Collection) containing all objects in store.

#### [update()](/docs/Table/Table.update())
Apply given changes to an existing object.

#### [where()](/docs/Table/Table.where())
Retrieve objects using a query.

### See Also
#### [Collection](/docs/Collection/Collection)
