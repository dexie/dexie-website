---
layout: docs-dexie-cloud
title: 'Table.newId()'
---

Create a new globally unique string for using as primary keys in objects.

## Syntax

```js
table.newId();
```

## Return Value

string

## Remarks

Generates a new globally unique ID. The ID will be dedicated to use for the current table only as it is prefixed with a short table alias. The ID also both sequancial and random at the same time as it consists of three parts:

| table-alias (18 bits) | current time (48 bits) | random (96 bits) |

The total bit-length of an ID is 162 bits.
As it is converted to a lexically sorted base64 version, the generates strings of 27 characters long:

"frn--z328SMysJzV20LoAAdnWOP"

If creating hundreds of thousands IDs in the same device and app runtime, ID is always guaranteed to be lexically greater than the previously generated ID even if created during the very same millisecond. This is solved by generating "future" IDs in the case of same-millisecond calls to the method. This guarantee is the most important one in order to get a predictable natural order of objects.

For IDs created at different dates or times by different devices, the ones created later are normally lexically greater than IDs created earlier. This is not 100% guaranteed for two reasons: 1) Possible differences in system clocks, 2) Possible creation of "future" IDs (described above). This feature is not cruzial.

The approximate creation timestamp can be extracted from object IDs.

The table that an object belongs (which is also the type) to can be extracted from the object ID.

Since IDs also contain the table alias, any object reference include all information to go and get the related object without having to tie the reference field to a target table (as is a limitation in other relational databases).

## Precondition

The Dexie database has to opened when calling this method. If not, an error of type [InvalidStateError](/docs/DexieErrors/Dexie.InvalidStateError) will be thrown.

## Example

```js
import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

const db = new Dexie("myDb", {addons: [dexieCloud]});
db.version(1).stores({
  friends: "id, name, age"
});

db.open().then(()=>{
  return db.friends.add({
    id: db.friends.newId(),
    name: "Foo",
    age: 33
  });
});

```
