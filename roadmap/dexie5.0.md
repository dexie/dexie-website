---
layout: docs
title: 'Road Map: Dexie 5.0'
---

Some of the features presented here were moved from the road map for dexie@4 in January 2024 when dexie@4 went into release candidate.

The goal for Dexie 5.0 will be a better experience for web developers to declare and query their data. What we'll be focusing on will be to query richness, paging and performance using some RAM-sparse caching. The goal is an intuitive and easy-to-use db API that performs well in large apps without sacrificing device resource usage.

We don't have a any dedicated time schedule of when dexie 5 will be in alpha, beta or feature complete. This road map may also be updated and modified along the way.

# Type Safe Declaration and Easier Class Mapping

DB declaration will be possible within a single expression instead of having to repeat declarations for the typings and for the actual schema (runtime).

```ts
class Friend {
  id = AutoPrimKey(Number); // Declares auto-incremented primary key
  name = Index(String); // Declares an index and that name is of type string
  age = Index(Number); // Declares an index and that age is of type number
  picture = Type(Blob); // Declares a non-indexed property of type Blob.
}

const db = new Dexie('friendsDB').stores({
  friends: Friend // Declares schema and maps the class
});

// As in dexie@4, versions / migrations are now optional!
```

#### Dexie's classical schema style

```js
// 1. Declare db
export const db = new Dexie('friendsDB');

// 2. Specify version(s) and schema(s)
db.version(1).stores({
  friends: '++id, name, age'
});
```

#### Type Friendly Declaration Style

Dexie will always be backward compatible, so the current style will continue to work. The new declaration style in Dexie 5, there will also be a new declaration style with the following benefits:

- One single declaration for both schema and typings
- No version number needed
- The class is automatically mapped, just like mapToClass() did work in earlier versions.

### Declaration Helpers

A new library 'dreamtype' will be released and will contains declarators for declaring class properties that provides a both typings and runtime information about properties. The dreamtype library is not tied to dexie. It's a standalone library for declaring runtime persistable types and contains a set of declarators along with a contract of how to extract the property infos from a class.

| Declarator      | Meaning                                                       |
| --------------- | ------------------------------------------------------------- |
| Type(T)         | Specifies type for both typescript and the running javascript |
| PrimKey(T)      | Primary key                                                   |
| AutoPrimKey(T)  | Auto-generated primary key                                    |
| ComboPrimKey(T) | Compound Primary Key                                          |
| Index(T)        | Indexed property                                              |
| ComboIndex(T)   | Compound index                                                |
| ArrayOf(T)      | Array                                                         |
| Optional(T)     | Optional property                                             |

#### Examples

Plain type without indexes

```ts
class Friend {
  id = PrimKey(String);
  name = Type(String);
  age = Type(Number);
}

// Equivalent declaration with classic dexie style:
db.version(x).stores({
  friends: 'id' // Non-indexed properties aren't specified in classical schemas
});
```

Indexed properties

```ts
class Friend {
  id = PrimKey(String);
  name = Index(String);
  age = Index(Number);
}

// Equivalent declaration with classic dexie style:
db.version(x).stores({
  friends: 'id, name, age'
});
```

Compound index

```ts
class Friend {
  id = PrimKey(String);
  name = Index(String);
  age = ComboIndex(Number, () => [this.name]); // [age+name]
}

// Equivalent declaration with classic dexie style:
db.version(x).stores({
  friends: 'id, name, [age+name]'
});
```

Multiple indexes on same property

```ts
class Friend {
  id = PrimKey(String);
  name = ComboIndex(
    String,
    () => [this.age], // [name+age]
    () => [this.shoeSize] // [name+shoeSize]
  );
  age = Index(Number);
  shoeSize = Type(number);
}

// Equivalent declaration with classic dexie style:
db.version(x).stores({
  friends: 'id, [name+age], [name+shoeSize], age';
});
```

Unique index

```ts
class User {
  userId = PrimKey(String); // Sets primary key to `userId`
  username = Index(String); // Adds normal index 'username'
  email = Index(String, UNIQUE); // Adds unique index '&email'
  domain = ComboIndex(String, () => [this.username, UNIQUE]); // Unique index '&[domain+username]'
}

// Equivalent declaration with classic dexie style:
db.version(x).stores({
  users: 'userId, username, &email, &[domain+username]';
});

```

Nested and optional properties

```ts
class Friend {
  id = PrimKey(String);
  address = {
    country: ComboIndex(String, () => [this.address.city]),
    city: Type(String),
    street: Type(String)
  };
  picture = Optional(Blob);
  shoeSize = Optional(Index(Number)); // Optional indexed property
}

// Equivalent declaration with classic dexie style:
db.version(x).stores({
  friends: 'id, [address.country+address.city], shoeSize';
});
```

Compound primary key

```ts
class UserGroupConnection {
  groupId = ComboPrimKey(String, () => [this.userId]);
  userId = Index(String);
}

// Equivalent declaration with classic dexie style:
db.version(x).stores({
  userGroups: '[groupId+userId], userId';
});

```

### Sub-classing Dexie

```ts
export class AppDB extends Dexie {
  friends = Table(Friend);
}

const db = new AppDB('appDB');
```

The sub-classed version above is equivalent to:

```ts
const db = new Dexie('appDB').stores({
  friends: Friend
});
```

Subclassing Dexie isn't required anymore for typings but it is still useful the declared class extends the `Entity` helper because it will have the properties `db` and `table` so that methods can perform operations on the database:

```ts
class Friends extends Entity<AppDB> {
  id = PrimKey(String);
  name = Type(String);
  age = Index(Number);

  // methods can access this.db because we're subclassing Entity<AppDB>
  async birthDay() {
    return this.db.friends.update(this.id, { age: add(1) });
  }
}
```

We will continue to support the old API so that applications aren't forced to go over to the type-safe schema declaration.

Notice that versions aren't needed for schema changes anymore. Here we diverge from native IndexedDB that require this. We work around it letting the declared version and the native version diverge. And when they do, we store the virtual version in a meta table on the database. This table will only be created on-demand, if a schema upgrade on same given version was needed. Basically, we continue working like before, unless the db has the $meta table - in which case the info there will be respected instead of the native one. If disliking the idea of diverging from the native IndexedDB version, keep declaring a version as with current Dexie and it won't need to add a $meta table.

Also, any methods in the type will be omitted from the insert type so that if you have a class with methods that backs the model of your table, you will continously be able to add items using plain objects (with methods omitted).

## Migrations

We've changed the view of migrations and version handling. Before the version was directly related to changes in the schema such as added tables or indexes. This was natural and corresponds to how IndexedDB works natively.

The only situations where you need a new version number in dexie@5 will be in one of the following situations:

- You want to rename a table or property
- You've refactored your model and need to move data around to comply with the new model

### New Migration Methods for Rename

Two new methods exists that can be used in migrations:

- renameTable()
- renameProperty()

#### Example: You want to rename a table or property or both:

You want to rename table "friends" to "contacts". You also want to rename a property on that model from "name" to "displayName":

```ts
const db = new Dexie('dbName').stores({
  contacts: Contact
});
db.version(2)
  .renameTable('friends => contacts')
  .renameProperty('contacts', 'name => displayName');
```

#### Example: You've refactored your model and need to move data around to comply with the new model

```ts
db.version(3)
  .upgrade(async (tx) => {
    await tx.table('contacts')?.toCollection().modify((contact) => {
      const [firstName, lastName] = contact.displayName?.split(' ') ?? [];
      contact.firstName = firstName;
      contact.lastName = lastName;
      delete contact.displayName;
    });
  })
  .downgrade('recreate'); // In case of downgrade - recreate the database (delete and reopen on prev version)
```

### Downgrade options

| Option              | Meaning                                                                          |
| ------------------- | -------------------------------------------------------------------------------- |
| `'allow'` (default) | Allow downgrade - reverse renaming of tables and props only - data is left as is |
| `'recreate'`        | Erase all data on downgrade                                                      |
| `'throw'`           | Do not allow downgrade (same as dexie 2 and 3 behavior)                          |

# Richer Queries

Dexie will support combinations of criterias within the same collection and support a subset of mongo-style queries. Dexie has before only supported queries that are fully utilizing at least one index. Where-clauses only allow fields that can be resolved using a plain or compound index. And `orderBy()` requires an index for ordering, making it impossible to combine with a critera, unless the criteria uses the same index. Currently, combining index-based and 'manual' filtering is possible using filter(), but it puts the burden onto the developer to determine which parts of the query that should utilize index and which parts should not. Dexie 5.0 will move away from this limitation and allow any combination of criterias within the same query. Resolving which parts to utilize index will be decided within the engine.

`orderBy()` will be available on Collection regardless of whether the current query already 'occupies' an index or not. It will support multiple fields including non-indexed ones, and allow to specify collation.

```ts
import { between, startsWith } from 'dexie';
await db.friends
  .where({
    name: 'foo',
    age: between(18, 65),
    'address.city': startsWith('S')
  })
  .orderBy(['age', 'name'])
  .offset(50)
  .limit(25)
  .toArray();
```

# Improved Paging

The cache will assist in improving paging. The caller will keep using offset()/limit() to do its paging. The difference will be that the engine can optimize an offset()-based query in case it starts close to an earlier query with the same criteria and order, so the caller will not need to use a new paging API

# Encryption

We will provide a new encryption addon, similar to the 3rd part [dexie-encrypted](https://github.com/mark43/dexie-encrypted) and [dexie-easy-encrypt](https://github.com/jaetask/dexie-easy-encrypt) addons. These addons will continue to work with dexie@5 but due to the lack of maintainance of we believe there's a need to have a maintained addon for such an important feature.

The syntax for initializing encryption is not yet decided on, but might not correspond to those of the current 3rd part addons.

# Breaking Changes

## No default export

We will stop exporting Dexie as a default export as it is easier to prohibit [dual package hazard](https://github.com/GeoffreyBooth/dual-package-hazard) when not exporting both named and default exports. Named exports have the upside of enabling tree shaking so we prefer using that only.

Already since Dexie 3.0, it has been possible to import { Dexie } as a named export. To prepare for Dexie 5.0, it can be wise to change your imports from `import Dexie from 'dexie'` to `import { Dexie } from 'dexie'` already today.

## More to come

Dexie has been pretty much backward compatible between major versions so far and the plan is to continue being backward compatible as much as possible. But there might be additional breaking changes to come and they will be listed here. This is a living document. Subscribe to our [github discussions](https://github.com/dexie/Dexie.js) or to the [blog](https://medium.com/dexie-js) if you want to get notified on updates.
