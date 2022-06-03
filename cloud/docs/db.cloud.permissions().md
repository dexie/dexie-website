---
layout: docs
title: "db.cloud.permissions()"
---

# Remarks

Observe security permissions for a table and individual objects managed by Dexie Cloud. Use this method in order to know whether to render certain action buttons depending on what permission the user has to modify the object or add / remove objects.

This is the non-react (plain observable) version of [usePermissions()](/docs/dexie-react-hooks/usePermissions()) to be consumed in frameworks such as Svelte, Angular or Vue.

# Dependencies

```
npm i dexie dexie-cloud-addon
```

# Syntax

```ts

// When table is not mapped to a DexieCloudEntity subclass:
const o = db.cloud.permissions("friends", databaseObject);

// When table is mapped to a DexieCloudEntity subclass:
const o = db.cloud.permissions(databaseObject);

// Result usage:
o.subscribe(can => {
  console.log("Can we add friends in the realm?", can.add('friends') ? "Yes!" : "No");
  console.log("Can we update friend.age on this particular friend?", can.update('age') ? "Yes!" : "No");
  console.log("Can we delete this particular friend?", can.delete() ? "Yes!" : "No");
});

```
If your table is declared using DexieCloudTable using a `Entity`-derived class mapped to the table using mapToClass(), as examplified in declaration of the TodoList class declared in [dexie-cloud-todo-app](https://github.com/dexie/Dexie.js/blob/v4.0.0-alpha.3/samples/dexie-cloud-todo-app/src/db/TodoDB.ts), you only need to provide a single argument - the entity itself as it already contains method to extract table name from it.

# Return Value

`Observable<PermissionChecker>`

```ts
export interface PermissionChecker {
  add(...tableNames: string[]): boolean;
  update(...props: string[]): boolean;
  delete(): boolean;
}
```

# See also

[usePermissions()](/docs/dexie-react-hooks/usePermissions())
