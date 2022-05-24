---
layout: docs
title: "usePermissions()"
---

# Remarks

Observe security permissions for a table and individual objects managed by Dexie Cloud. Use this hook in order to know whether to render certain action buttons depending on what permission the user has to modify the object or add / remove objects.

# Dependencies

```
npm i react dexie dexie-cloud-addon dexie-react-hooks
```
or
```
yarn add react dexie dexie-cloud-addon dexie-react-hooks
```

# Syntax

```ts
export function usePermissions<T>(db: Dexie, table: string | Table, obj: T): PermissionChecker<T>;

export function usePermissions<T extends DexieCloudEntity>(entity: T): PermissionChecker<T>;

export interface PermissionChecker<T> {
  add(...tableNames: string[]): boolean;
  update(...props: string[]): boolean;
  delete(): boolean;
}
```

| Parameter         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| db        | A Dexie instance with dexie-cloud addon active |
| table | A table name or Table instance              |
| obj          | An object retrieved from a dexie query |
| entity     | If your table is declared using DexieCloudTable using a `Entity`-derive class mapped to the table using mapToClass(), as examplified in declaration of the TodoList class declared in [dexie-cloud-todo-app](https://github.com/dexie/Dexie.js/blob/v4.0.0-alpha.3/samples/dexie-cloud-todo-app/src/db/TodoDB.ts), you only need to provide a single argument - the entity itself |


# Sample

See dexie-cloud-todo-app's [TodoListView.tsx](https://github.com/dexie/Dexie.js/blob/v4.0.0-alpha.3/samples/dexie-cloud-todo-app/src/components/TodoListView.tsx), [TodoItemView.tsx](https://github.com/dexie/Dexie.js/blob/v4.0.0-alpha.3/samples/dexie-cloud-todo-app/src/components/TodoItemView.tsx) and [TodoDB.ts](https://github.com/dexie/Dexie.js/blob/v4.0.0-alpha.3/samples/dexie-cloud-todo-app/src/db/TodoDB.ts)

