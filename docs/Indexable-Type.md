---
layout: docs
title: 'Indexable Type'
---

The following javascript types are possible to index:

* string
* number
* Date
* Arrays of strings, numbers, Dates or a mix of those.
* ArrayBuffer (IndexedDB 2.0 only)
* Typed arrays (IndexedDB 2.0 only)

Note that all other types are non-indexable, including:

* boolean
* undefined
* Object
* null

## Sample

```javascript

const db = new Dexie('testdb');
db.version(1).stores({
    foo: 'id,bar'
});

db.foo.put({id: null}); // fails with DataError because null is not indexable.
db.foo.put({id: 1, bar: null}); // succeeds but fails silently to be indexed by "bar" index.
db.foo.where('bar').equals(undefined).toArray(); // Fails with DataError as undefined is not indexable.

```
