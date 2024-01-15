---
layout: docs
title: 'Road Map: Dexie 4.0'
---

The feature planned for Dexie@4 has been splitted in January 2024 between [dexie@4](dexie4.0) and [dexie@5](dexie5.0). All non-implemented features have moved to the road map of [dexie@5](dexie5.0.md). The news in Dexie 4.0 is now limited to better typings, optimized live queries and a more stable IndexedDB experience by working around new browser bugs in Chrome and Safari. Dexie@4 also has the option to connect to [Dexie Cloud](/cloud/) to create web apps that continously sync their offline data with the cloud.

[Discussions and feedback on Dexie 4.0 road map](https://github.com/dexie/Dexie.js/discussions/1455)

# Cache

Non-transactional live queries utilize memory cache to assist in query resolution. It is possible to opt-out from using the cache using the option `{cache: 'disabled'}`. The cache can greatly improve simple pure range-based live queries and reduce the queries towards IndexedDB by reusing common queries from different components. The cache will be continously developed and optimized further to improve the new paging support in [Dexie 5.0](dexie5.0).

# Workarounds for flaky browsers

Dexie 4 catches various issues in the IndexedDB support for Chrome and Safari. Without dexie@4 tranasactions and write operations can suddenly fail in modern versions of Chrome and Safari but dexie makes sure to protect the end user from experience any issues. It does this by reopening the database or redoing the transaction when these things happen - all without the developer having to worry about it. See issues [#543](https://github.com/dexie/Dexie.js/issues/543), [#613](https://github.com/dexie/Dexie.js/issues/613), [#1660](https://github.com/dexie/Dexie.js/issues/1660) and [#1829](https://github.com/dexie/Dexie.js/issues/1829).

# Supports Dexie Cloud

With Dexie 4.0, you can optionally use [dexie-cloud-addon](/cloud/docs/dexie-cloud-addon) and connect your local database with a cloud based database. [Dexie Cloud](/cloud/) is a complete solution for authorization and synchronization of personal data with support for sharing data between users.

# Improved Typing

Dexie 4 has some improved typing. Specifically, [Collection.modify()](</docs/Collection/Collection.modify()>) and [Table.update()](</docs/Table/Table.update()>) use template literals to suggest code completion and type checking of keypaths to update.

## Distinguish insert- from output types

The type passed to db.table.add() can be different from the type returned from db.table.get() and tb.table.toArray(). This mirrors reality better since some properties may be optional when adding (such as an auto-incremented primary key or dexie-cloud properties `realmId` and `owner`).

The generic type `Table<T, TKey>` is extended with a 3rd optional parameter `TInsertType` making it possible to declare a table as such:

```ts
class MyDB extends Dexie {
  friends!: Table<
    { id: number; name: string; age: number }, // T (id is always there)
    number, // TKey (type of primary key)
    { id?: number; name: string; age: number } // TInsertType (id is optional)
  >;
}
```

A new helper generic `EntityTable<T>` also exists as a "don't repeat yourself" sugar on top of this, and will also omit any method on the type. In case the type is a mapped class with helper methods, you are still able to pass simple POJO objects
to add() and put() with only data properties.

```ts
interface Friend {
  id: number;
  name: string;
  age: number;
}

class MyDB extends Dexie {
  friends!: EntityTable<Friend, 'id'>; // Automatically makes `id` optional when adding and picks its TKey type.
}
```

If using Dexie Cloud, there's a `DexieCloudTable<T>` generic that will declare the implicit Dexie Cloud properties on the entity correctly for insert- and output types:

```ts
interface Friend {
  id: string;
  name: string;
  age: number;
  realmId: string;
  owner: string;
}

class MyDexieCloudDB extends Dexie {
  friends!: DexieCloudTable<Friend, 'id'>; // Makes id, realmId and owner optional on insert operations.
}
```

## A solution to dependency issues with mapped classes

In dexie 3, a mapped class that needs to access the database from its methods, will needs to access the a `db` instance. But it is a bit awkward to tie a method body to the same instance exported from the `db` module. For example, having two instances of db with different constructor parameters would not work as both would use one of the instances from their method bodies.

In Dexie 4.0, this is solved using a lightweight dependency injection. There is a generic class `Entity` that your classes may extend from in order to get your database instance injected as a protected property `db` on every entity instance. Your class methods can then perform queries onto the db without being dependant on the `db` module of your app. This use case will require a subclassed Dexie declaration though. There will still be cyclic import dependencies but only on the type level.

```ts
export class Friend extends Entity<AppDB> {
  id!: number;
  name!: string;
  age!: number;

  async birthday() {
    return await this.db.friends.update(this.id, (friend) => ++friend.age);
  }
}
```

# Breaking Changes

## No IE11 support

No support for Internet Explorer 11, legacy Edge (non-chromium) nor legacy Safari below version 14.

# Discuss or give feedback

There's a github discussion dedicated for Dexie 4.0. Please feel free to give your feedback and comments there

[Discussions and feedback on Dexie 4.0 road map](https://github.com/dexie/Dexie.js/discussions/1455)
