---
layout: docs
title: 'Typescript'
---

This is a guide on how to use Dexie with Typescript using dexie@4.0 - a little more lightweight than than the old docs by utilizing new features in 4.0. Since dexie@4 is practically backward compatible, you may also still follow [the old Typescript](Typescript-old) docs if your prefer so.

## Install dexie

Typings are part of the npm package so there's no need to for any @types library.

```bash
npm install dexie
```

_Like all other npm packages, dexie can also be installed using yarn or pnpm as alternatives to npm._

## Simplest Typescript Example

If you are storing plain data and just want the typing to reflect your data:

```ts
//
// db.ts
//

// EntityTable is new in 4.0 and improves typings
import Dexie, { EntityTable } from "dexie";

export const db = new Dexie("FriendsDatabase") as Dexie & {
  friends: EntityTable<Friend, 'id'>; // Make sure to reflect schema declaration below!
};

// Schema declaration.
db.version(1).stores({
  friends: "++id, name, age"; // table name "friends". Primary key "id".
});

export interface Friend {
  id: number;
  name: string;
  age: number;
}

```

### What is EntityTable?

EntityTable is a generic type that provide a more exactly typed [Table](Table/Table) based on supplied entity type and it's primary key property. Methods such as [Table.add()](<Table/Table.add()>), [Table.put()](<Table/Table.put()>) etc will expect a variant of the provided entity type where the primary key is optional, while methods such as [Collection.toArray()](<Collection/Collection.toArray()>), [Table.get()](<Table/Table.get()>) etc will return data typed with the provided entity type as it is declared and exported (interface Friend {...} in this case).

### Differencies between Table&lt;T&gt; and EntityTable&lt;T&gt;

`Table<T, TKey, TInsertType=T>` is the building block for `EntityTable<T, KeyPropName>`. Table allows an optional 3rd argument `TInsertType` that is expected from [Table.add()](<Table/Table.add()>), [Table.put()](<Table/Table.put()>) etc. That's where we want to provide a version of our type where the primary key is optional (as it can be auto-generated).

`EntityTable<T, KeyPropName>` is new in Dexie 4 and provides syntactic sugar on top of `Table` so it can be used with optional primary key and classes that may have methods:

1. It defines the TInsertType where primary key is optional and methods are omitted.
2. It extracts the TKey type from T[KeyPropName]

## Example with Mapped Classes

Here's an example of how to use mapped classes in Dexie 4.

There are three modules:

- db.ts - _exports the singleton Dexie instance_. To be imported wherever your db is needed.
- AppDB.ts - _declaration of database schema_
- Friend.ts - _Entity class example. You could have muliple modules like this_

```ts
//
// db.ts
//

import { AppDB } from './AppDB';

export const db = new AppDB();
```

```ts
//
// AppDB.ts
//

import Dexie, { EntityTable } from 'dexie';
import { Friend } from './Friend';

export class AppDB extends Dexie {
  friends!: EntityTable<Friend, 'id'>;

  constructor() {
    super('FriendsDB');
    this.version(1).stores({
      friends: '++id, name, age'
    });
    this.friends.mapToClass(Friend);
  }
}
```

```ts
//
// Friend.ts
//

import { Entity } from 'dexie';
import { AppDB } from './AppDB';

export class Friend extends Entity<AppDB> {
  id: number;
  name: string;
  age: number;

  // example method that access the DB:
  async birthday() {
    // this.db is inherited from Entity<AppDB>:
    await this.db.friends.update(this.id, (friend) => ++friend.age);
  }
}
```

### DexieCloudTable

If you are using [dexie-cloud-addon](/cloud/docs/dexie-cloud-addon), synced tables have a few more properties that, similar to auto-generated primary keys, are optional on insert but "required"/mandatory on all instances returned from db queries: `owner` and `realmId`. DexieCloudTable is therefore a better generic to use for synced tables with dexie cloud.

```ts
//
// AppDB.ts
//

import Dexie from 'dexie';
import dexieCloud, {
  DexieCloudTable,
  DexieCloudEntity
} from 'dexie-cloud-addon';
import { Friend } from './Friend';

export class AppDB extends Dexie {
  friends!: DexieCloudTable<Friend, 'id'>;

  constructor() {
    super('FriendsDB', {
      addons: [dexieCloud]
    });

    this.version(1).stores({
      friends: '@id, name, age'
    });

    this.friends.mapToClass(Friend);
  }
}

//
// Friend.ts
//
export class Friend extends Entity<AppDB> {
  id: string;
  name: string;
  age: number;
  owner: string;
  realmId: string;
}

db.version(1).stores({
  friends: '@id, name, age'
});

//
// Usage examples
//

// add
db.friends.add({ name: 'Foo', age: 25 }); // Ok to leave out id, realmId and owner as they are all auto-generated.

// query
const friends = (await db.friends.toArray()) satisfies Friend[];
// friends is now an array of your declared Friend class with all properties on:
//   id,
//   name,
//   age,
//   owner,
//   realmId
```
