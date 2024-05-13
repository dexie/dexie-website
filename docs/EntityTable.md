---
layout: docs
title: 'EntityTable'
---

EntityTable is useful when any of the following criterias are true:

- Primary key is auto-generated (`++id`)
- The type is represented by a class with methods.

Else, if you are using method-less entities or primary key is not auto-generated, you can use [Table](#example-with-table) instead.

EntityTable is a helper type that provides typings for [Table](Table/Table) based on supplied entity type and it's primary key property. Methods such as [Table.add()](<Table/Table.add()>), [Table.put()](<Table/Table.put()>) etc will expect plain javascript objects that corresponds to the provided entity type where the primary key is optional.

## Differencies between Table&lt;T&gt; and EntityTable&lt;T&gt;

Dexie also exports a generic `Table<T, TKey, TInsertType=T>` that could be used instead of EntityTable if preferring so. `Table<T, TKey, TInsertType=T>` is the building block for `EntityTable<T, KeyPropName>`. It allows an optional 3rd argument `TInsertType` that is expected from [Table.add()](<Table/Table.add()>), [Table.put()](<Table/Table.put()>) etc. That's where we want to provide a version of our type where the primary key is optional (as it can be auto-generated).

`EntityTable<T, KeyPropName>` is new in Dexie 4 and provides syntactic sugar on top of `Table<T, TKey, TInsertType>`:

1. It defines the TInsertType where primary key is optional and any class methods are omitted (so that plain javascript objects can be provided to [Table.add()](<Table/Table.add()>), instead of having to construct using new())
2. It extracts the TKey type from T[KeyPropName]

### Example with Table

```ts
import Dexie, { type Table } from 'dexie';

const db = new Dexie('FriendsDatabase') as Dexie & {
  friends: Table<Friend, number>;
};

interface Friend {
  id: number;
  name: string;
  age: string;
}

// Schema declaration:
db.version(1).stores({
  friends: `
    id,
    name,
    age`
});
```

### Example with EntityTable

```ts
import Dexie, { type EntityTable } from 'dexie';

const db = new Dexie('FriendsDatabase') as Dexie & {
  friends: EntityTable<Friend, 'id'>;
};

interface Friend {
  id: number;
  name: string;
  age: string;
}

// Schema declaration:
db.version(1).stores({
  friends: `
    ++id,
    name,
    age`
});
```
