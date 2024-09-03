---
layout: docs
title: 'Typescript'
---

This is a guide on how to use Dexie with Typescript using Dexie 4 - a little more lightweight than the old docs by utilizing new features in 4.0. Since Dexie 4 is practically backward compatible, you may also still follow [the old Typescript](Typescript-old) docs if your prefer to do so.

## Install dexie

Typings are part of the npm package so there's no need to for any @types library.

```bash
npm install dexie
```

_Like all other npm packages, dexie can also be installed using yarn or pnpm as alternatives to npm._

## Simplest Typescript Example

If you are storing plain data and just want the a minimal get-started code in a single module. You can extend this sample with additional tables and corresponding interfaces:

### db.ts

```ts
import Dexie, { type EntityTable } from 'dexie';

interface Friend {
  id: number; // This prop will be used as primary key (see below)
  name: string;
  age: number;
}

const db = new Dexie('FriendsDatabase') as Dexie & {
  friends: EntityTable<Friend, 'id'>
};

// Schema declaration:
db.version(1).stores({
  friends: '++id, name, age' // primary key "id" (for the runtime!)
});

export type { Friend };
export { db };
```

_See [EntityTable](EntityTable)_

## Example with Mapped Classes

Here's an example of how to use mapped classes in Dexie 4. In this example, we split `db.ts` into three different modules:

- **db.ts** - _exports the singleton Dexie instance_. To be imported wherever your db is needed.
- **AppDB.ts** - _declaration of database schema_
- **Friend.ts** - _Entity class example. You could have muliple modules like this_

### db.ts

```ts
// db.ts
import AppDB from './AppDB';

export const db = new AppDB();
```

### AppDB.ts

```ts
// AppDB.ts
import Dexie, { type EntityTable } from 'dexie';
import Friend from './Friend';

export default class AppDB extends Dexie {
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

### Friend.ts

```ts
// Friend.ts

import { Entity } from 'dexie';
import type AppDB from './AppDB';

export default class Friend extends Entity<AppDB> {
  id!: number;
  name!: string;
  age!: number;

  // example method that access the DB:
  async birthday() {
    // this.db is inherited from Entity<AppDB>:
    await this.db.friends.update(this.id, (friend) => ++friend.age);
  }
}
```

### Usage examples

**React component**

```tsx
import { db } from './db';
import { useLiveQuery } from 'dexie-react-hooks';

function MyReactComponent() {
  const friends = useLiveQuery(() => db.friends.toArray());
  return (
    <ul>
      {friends?.map((f) => (
        <li key={f.id}>
          {f.name}, {f.age}
        </li>
      ))}
    </ul>
  );
}
```

**Plain Typescript**

```ts
import { db } from './db';

async function addFriend(name: string, age: number) {
  await db.friends.add({ name, age });
}

async function updateFriend(id: number, updates: Partial<Friend>) {
  await db.friends.update(id, { ...updates });
}

async function deleteFriend(id: number) {
  await db.friends.delete(id);
}
```

## Example with Dexie Cloud

Synced tables have a few more properties that, similar to auto-generated primary keys, are optional on insert but "required"/mandatory on all instances returned from db queries: `owner` and `realmId`. DexieCloudTable is therefore a better helper type to use for synced tables with dexie-cloud-addon.

### AppDB.ts - Dexie Cloud version

```ts
import Dexie from 'dexie';
import dexieCloud, { type DexieCloudTable } from 'dexie-cloud-addon';
import Friend from './Friend';

export default class AppDB extends Dexie {
  friends!: DexieCloudTable<Friend, 'id'>;

  constructor() {
    super('FriendsDB', {
      addons: [dexieCloud]
    });

    this.version(1).stores({
      friends: '@id, name, age'
    });

    this.friends.mapToClass(Friend);

    this.cloud.configure({
      databaseUrl: 'https://xxxxxx.dexie.cloud'
      // see https://dexie.org/cloud/docs/db.cloud.configure()
    });
  }
}
```

### Friend.ts - Dexie Cloud version

```ts
import type AppDB from './AppDB';

export default class Friend extends Entity<AppDB> {
  id!: string; // Primary key is string
  name!: string;
  age!: number;
  owner!: string; // Dexie Cloud specific property
  realmId!: string; // Dexie Cloud specific property
}
```

### Usage examples - Dexie Cloud version

The usage is almost identical to the plain Dexie version. But this example will show how [usePermissions](</docs/dexie-react-hooks/usePermissions()>) can help to get information about access control.

**React component**

```tsx
import { db } from './db';
import { useLiveQuery, usePermissions } from 'dexie-react-hooks';
import type { Friend } from './Friend'; // ...where class Friend is defined (see earlier on this page).

function MyReactComponent() {
  const friends = useLiveQuery(() => db.friends.toArray());
  return (
    <ul>
      {friends?.map((f) => (
        <li key={f.id}>
          <FriendComponent friend={f} />
        </li>
      ))}
    </ul>
  );
}

function FriendComponent({ friend }: { friend: Friend }) {
  const can = usePermissions(friend); // https://dexie.org/docs/dexie-react-hooks/usePermissions()
  // This 'can' instance can be used to check whether access control would permit the current user to
  // perform various actions. This information can be used to disable or hide fields and buttons.
  // (See also https://dexie.org/cloud/docs/access-control)
  return (
    <>
      Name: {friend.name} <br />
      Age: {friend.age} <br />
      Can I edit name?: {can.update('name') ? 'Yes!' : 'No!'} <br />
      Can I edit age?: {can.update('age') ? 'Yes!' : 'No!'} <br />
      Can I delete this friend?: {can.delete() ? 'Yes!' : 'No!'} <br />
    </>
  );
}
```

**Plain Typescript**

```ts
import { db } from './db';

async function addFriend(name: string, age: number) {
  // Ok to leave out id, realmId and owner as they are all auto-generated:
  await db.friends.add({ name, age });
}

async function updateFriend(id: string, updates: Partial<Friend>) {
  await db.friends.update(id, { ...updates });
}

async function deleteFriend(id: string) {
  await db.friends.delete(id);
}
```
