---
layout: docs
title: 'Indexable Type'
---

The following javascript types are possible to index:

* number
* Date
* string
* ArrayBuffer
* Typed arrays (Uint8Array, Float32Array, ..., etc)
* Arrays of (strings, numbers, Dates, ArrayBuffer, Typed array) or a mix of those.

Note that all other types are non-indexable, including:

* boolean
* undefined
* Object
* null

## Type order

Index keys of different types can be compared against each other. The following order applies:

1. -Infinity
2. number
3. Infinity
4. Date
5. string
6. [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) and [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
7. Arrays

## Lowest and Highest possible keys

* The lowest possible value is `-Infinity`. Dexie has an alias for it: `Dexie.minKey`.
* There is theoretically no highest possible value as Array may contain Arrays of Arrays etc... But Dexie provide an alias for the practical maximum key `Dexie.maxKey = [[]]` (an array of an array).

## See also

https://w3c.github.io/IndexedDB/#key-type


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
