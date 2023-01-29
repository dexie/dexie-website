---
layout: docs
title: "Table.bulkUpdate()"
---

*Since v4.0.1-alpha.6*

### Syntax

```ts
await table.bulkUpdate([
  {
    key: key1,
    changes: {
      "keyPath1": newValue1,
      "keyPath2": newValue2,
      ...
    }
  },
  {
    key: key2,
    changes: {
      "keyPathA": newValueA,
      "keyPathB": newValueB,
      ...
    }
  },
  ...
]);

```

### Declaration

```ts

class Table<T> {
  ...

  bulkUpdate(keysAndChanges: ReadonlyArray<{
    key: IndexableType,
    changes: UpdateSpec
  }>): Promise<number>

  ...
}
```

### Parameters

|                |                                                                                       |
| -------------- | ------------------------------------------------------------------------------------- |
| keysAndChanges | Array of entries containing the key to update and the updates to make                 |
| key            | Primary key of the object to update                                                   |
| changes        | An object where each key is a property name or path and its value is the value to set |

### Remarks

Updates given keys with given changes if the keys are found in the database table. If a key is not found, its corresponding changes wont be applied but the method will still succeed. The return value indicates how many keys were found (and updated).
This method is the bulk-version of [Table.update()](Table.update()) such that it accepts an array of keys/changes instead of a single key and changes-object.

The `UpdateSpec` provided in `changes` prop of each item can specify individual properties to be updated or deleted. Existing properties will be updated and non-existing properties will be added (if the row pointed out by the key exists). If the value provided is explicitely set to undefined, the property will be deleted.

Array properties follow the same keyPath pattern as object properties - using number as parts of the property name, such as `tags.0`, `tags.1` etc, see sample below.

### Sample

```ts
import Dexie, { EntityTable } from 'dexie';

interface Contact {
  id: number;
  name: string;
  tags: string[];
  address: {
    city: string;
    street: string;
    streetNo: number;
  }
}

const db = new Dexie('contactDB') as Dexie & {
  contacts: EntityTable<Contact, 'id'>;
};

db.version(1).stores({
  contacts: '++id, name, *tags, address.city'
});


await db.friends.bulkUpdate([
  // Update "name" property of contact with id 2:
  {
    key: 2,
    changes: {
      name: "Foo Barsson",
    }
  },
  // Update nested property "address.streetNo" of contact with id 1:
  {
    key: 1,
    changes: {
      "address.streetNo": 2
    }
  },
  // Replace entire "address" property of contact with id 3:
  {
    key: 3,
    changes: {
      address: {
        city: "Stockholm".
        street: "Sveavägen",
        streetNo: 18
      }
    }
  },
  // Delete the nested property "address.city" of contact with id 5:
  {
    key: 5,
    "address.city": undefined
  },
  // Add tags to contact with id 18:
  {
    key: 18,
    tags: ["close-friend", "family"]
  },
  // Update tag[1] of contact with id 33:
  {
    key: 33,
    "tags.1": "enemy"
  }
]);

```

### Return Value

```ts
Promise<number>
```

The method returns the number of matching rows that were updated. A row is counted when a given key is found in the table, no matter if the update modifies the value to something that differs or not.

### Errors

If some operations fail, `bulkUpdate()` will return a rejected Promise with a
[Dexie.BulkError](/docs/DexieErrors/Dexie.BulkError) referencing the failures.


### See Also

[Table.update()](</docs/Table/Table.update()>)

[Table.bulkDelete()](</docs/Table/Table.bulkPut()>)

[Table.bulkGet()](</docs/Table/Table.bulkGet()>)

[Table.bulkAdd()](</docs/Table/Table.bulkAdd()>)

[Table.bulkDelete()](</docs/Table/Table.bulkDelete()>)

