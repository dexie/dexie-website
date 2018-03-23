---
layout: docs
title: 'Dexie.Syncable.IDatabaseChange'
---

## Interface Definition

```typescript
enum DatabaseChangeType {
    Create = 1,
    Update = 2,
    Delete = 3
}

interface ICreateChange {
    type: DatabaseChangeType.Create,
    table: string;
    key: any;
    obj: any;
}

interface IUpdateChange {
    type: DatabaseChangeType.Update;
    table: string;
    key: any;
    mods: {[keyPath: string]:any | undefined};
}

interface IDeleteChange {
    type: DatabaseChangeType.Delete;
    table: string;
    key: any;
}

type IDatabaseChange = ICreateChange | IUpdateChange | IDeleteChange; 
```

## Description

Javascript interface of a database change. The property `type` tells whether the change is a creation (1), update (2) or deletion (3) of the given key in the given table.

If change is a creation, `obj` will contain the created object. 

If change is an update, `mods` will contain a set of property paths and their altered values. A property path is the name of the property for root-properties. For nestled properties, the property path will be a dot-based path to the changed property.

## Sample

Given the following object:

```javascript
{
    id: "faec7477-aaff-4525-a2d8-b817f8197bf7",
    address: {
        street: "Elm Street",
        city: "New York"
    }
}
```

_Assuming that 'id' is the primary key and the name of the table is "table"_

If street has been changed to "East 13:th Street", the IUpdateChange would look like this:

```javascript
{
    type: 2, // UPDATE
    table: "table",
    key: "faec7477-aaff-4525-a2d8-b817f8197bf7",
    mods: {
        "address.street": "East 13:th Street"
    }
}
```
