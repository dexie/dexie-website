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
Atomic CRUD hook called when an object is about to be created in a database.

#### [hook('reading')](/docs/Table/Table.hook('reading'))
Atomic CRUD hook called when an object has been read from a database and is about to be delivered to the caller.

#### [hook('updating')](/docs/Table/Table.hook('updating'))
Atomic CRUD hook called when an object is about to be modified in a database.

#### [hook('deleting')](/docs/Table/Table.hook('deleting'))
Atomic CRUD hook called when an object is about to be deleted from a database.

### Methods

#### [add()](/docs/Table/Table.add())
Insert an object into the store.

#### [bulkAdd()](/docs/Table/Table.bulkAdd())
Same as [add()](/docs/Table/Table.add()) but takes array arguments and is optimized for adding a large number of objects.

#### [bulkDelete()](/docs/Table/Table.bulkDelete())
Same as [delete()](/docs/Table/Table.delete()) but takes an array of keys and is optimized for deleting a large number of objects.

#### [bulkPut()](/docs/Table/Table.bulkPut())
Same as [put()](/docs/Table/Table.put()) but takes array arguments and is optimized for putting a large number of objects.

#### [clear()](/docs/Table/Table.clear())
Clear all objects in the store.

#### [count()](/docs/Table/Table.count())
Count all objects.

#### [defineClass()](/docs/Table/Table.defineClass())
Define a JavaScript constructor function and map to this table.

#### [delete()](/docs/Table/Table.delete())
Delete an object from the store.

#### [each()](/docs/Table/Table.each())
Iterate over all objects in the store.

#### [filter()](/docs/Table/Table.filter())
Apply a JavaScript filter on all items in the object store.

#### [get()](/docs/Table/Table.get())
Retrieve an object by primary key.

#### [limit()](/docs/Table/Table.limit())
Returns a Collection instance ordered by primary key, limited to N items.

#### [mapToClass()](/docs/Table/Table.mapToClass())
Map this table to a JavaScript constructor function.

#### [orderBy()](/docs/Table/Table.orderBy())
Returns a Collection instance ordered by the given index.

#### [offset()](/docs/Table/Table.offset())
Returns a Collection instance ordered by the primary key, where the first N items in the table are ignored.

#### [put()](/docs/Table/Table.put())
Replace or insert an object.

#### [reverse()](/docs/Table/Table.reverse())
Returns a Collection instance in reverse order of the primary key.

#### [toArray()](/docs/Table/Table.toArray())
Get an array containing all objects in the store.

#### [toCollection()](/docs/Table/Table.toCollection())
Get a [Collection](/docs/Collection/Collection) instance containing all of the objects in the store.

#### [update()](/docs/Table/Table.update())
Apply the given changes to an existing object.

#### [where()](/docs/Table/Table.where())
Retrieve objects using a query.

### See Also
#### [Collection](/docs/Collection/Collection)
