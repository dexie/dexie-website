---
layout: docs
title: 'Road Map: Dexie 4.0'
---

The goal for Dexie 4.0 will be a better experience for web developers to query their data. We've already improved usability in [Dexie 3.2](https://github.com/dfahlander/Dexie.js/releases/tag/v3.2.0) with [liveQuery()](https://dexie.org/docs/liveQuery()). What we'll be focusing on will be to query richness, paging and performance using caching. The goal is an intuitive and easy-to-use db API that performs well in large apps.

[Github Milestone for Dexie 4.0](https://github.com/dfahlander/Dexie.js/milestone/3)

[Discussions and feedback on Dexie 4.0 road map](https://github.com/dfahlander/Dexie.js/discussions/1455)

# Versionless declaration
Dexie 4.0 will support the declaration of tables and indexes without specifying any version. We want to separate migration from table/index changes.

#### Current style
```js
export const db = new Dexie('dbName');
db.version(1).stores({
  friends: '++id, name, age',
});
```

#### Dexie 4.0 style
```js
// Dexie 4.0 style:
export const db = new Dexie('dbName').stores({
  friends: '++id, name, age',
});
```

The new declarative style also makes type inference and code completion work better as the generated table props will be infered from the declaration.

We will continue to support the `.version(x).stores()` API so that applications aren't forced to go over to the versionless declaration.

 Internally dexie will increment versions dynamically for the user when using the new declaration style - whenever there is a need to modify tables or indexes, it will auto-increment the version. However, it will still support given versions for migration upgraders in the old format. To accomplish that we allow the native version to diverge from 'virtual' versions by maintaing it in a versions-table within the database. This table will only be created after utilizing the new style declaration combined a dedicated version (old style). Basically, we continue working like before, unless the db has the $versions table - in which case the info there will be respected instead of the native one. 

# Simple typings for Typescript users
Instead of having to subclass Dexie, Typescript users have the declaration inferred without doing anything. However, the properties on the models will not be typed. Therefore we'll add a new way to annotate tables with the backing type.

```ts
const db = new Dexie('dbName').stores({
  friends: Typed<Friend>('++id, name, age')
});

interface Friend {
  id: number;
  name: string;
  age: number
}
```
More than this, we will be distinguishing between insert- and outgoing type. The declared type will represent the outgoing type while the insert type will convert the primary key to be optional in case the declaration declares it auto-incremented ('++id') or otherwise generated as in [Dexie Cloud](https://dexie.org/cloud/) ('@id'). Methods like [Table.add()](https://dexie.org/docs/Table/Table.add()) will expect the insert type while [Collection.toArray()](https://dexie.org/docs/Collection/Collection.toArray()) will return a promise of an array of the declared type.

Also, methods will be omitted from the insert type so that if you have a class with methods that backs the model of your table, you will continously be able to add items using plain objects (with methods omitted).

# Improved Class Mapping
Today there is [mapToClass()](https://dexie.org/docs/Table/Table.mapToClass()) that allows a table to be backed by class prototypes - so that data being returned from queries are not just PoJo Obejcts but instances of the mapped class. This will be possible to declare in a more declarative way than the imperative `mapToClass()` - which will also infere the type for typescript users.

```ts
import { MappedClass, Dexie } from 'dexie';

const db = new Dexie('dbName').stores({
  friends: MappedClass(Friend, '++id, name, age')
});

class Friend {
  id!: number;
  name!: string;
  age!: numner;
}
```

## A solution to dependency issues with mapped classes
Today, a mapped class that needs to access the database from its methods, will needs to access the `db` instance. This goes fine when both entities and database are declared in a single module but can cause recursive import problems when separating entity declaration from the db declaration into their own modules.

In Dexie 4.0, this is solved using a lightweight depenency injection. There will be a generic class `Entity` that your classes may extend from in order to get your database instance injected as a protected property `db` on every entity instance. Your class methods can then perform queries onto the db without being dependant on the `db` module of your app. This use case will require a subclassed Dexie declaration though. There will still be cyclic import dependencies but only on the type level.

```ts
export class Friend extends Entity<DB> {
  id!: number;
  name!: string;
  age!: number;

  async birthday() {
    return await this.db.friends.update(this.id, friend => ++friend.age);
  }
}

export class DB extends Dexie {
  friends = new Table(Friend, '++id, name, age');
}
```

# Richer Queries

Dexie will support combinations of criterias within the same collection and support a subset of mongo-style queries. Dexie has before only supported queries that are fully utilizing at least one index. Where-clauses only allow fields that can be resolved using a plain or compound index. And `orderBy()` requires an index for ordering, making it impossible to combine with a critera, unless the criteria uses the same index. Currently, combining index-based and 'manual' filtering is possible using filter(), but it puts the burden onto the developer to determine which parts of the query that should utilize index and which parts should not. Dexie 4.0 will move away from this limitation and allow any combination of criterias within the same query. Resolving which parts to utilize index will be decided within the engine.

OrderBy() will be available on Collection regardless of whether the current query already 'occupies' an index or not. It will support multiple fields including non-indexed ones, and allow to specify collation.

```ts
import { between, startsWith } from 'dexie';
await db.friends.where({
  name: 'foo',
  age: between(18, 65),
  "address.city": startsWith("S")
})
  .orderBy(['age', 'name'])
  .offset(50)
  .limit(25)
  .toArray();
```

# Cache
Non-transactional queries will utilize memory cache to assist in query resolution. It will be possible to opt-out from using the cache. This will greatly improve paging and live queries.

# Improved Paging
The cache will assist in improving paging. The caller will keep using offset()/limit() to do its paging. The difference will be that the engine can optimize an offset()-based query in case it starts close to an earlier query with the same criteria and order, so the caller will not need to use a new paging API

# Breaking Changes

## No default export
We will stop exporting Dexie as a default export as it is easier to prohibit [dual package hazard](https://github.com/GeoffreyBooth/dual-package-hazard) when not exporting both named and default exports. Named exports have the upside of enabling tree shaking so we prefer using that only.

Already since Dexie 3.0, it has been possible to import { Dexie } as a named export. To prepare for Dexie 4.0, it can be wise to change your imports from `import Dexie from 'dexie'` to `import { Dexie } from 'dexie'` already today.

## More to come
There might be more breaking changes to come. This is a living document. Subscribe to our [github discussions](https://github.com/dfahlander/Dexie.js) or to the [blog](https://medium.com/dexie-js).

# Discuss or give feedback
There's a github discussion dedicated for Dexie 4.0. Please feel free to give your feedback and comments there

[Discussions and feedback on Dexie 4.0 road map](https://github.com/dfahlander/Dexie.js/discussions/1455)
