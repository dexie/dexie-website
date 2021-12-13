---
layout: docs
title: 'Dexie.use()'
---

### Syntax

```javascript
db.use({stack, name?, create})
```

### Properties of the parameter
<table>
  <tr>
    <td>stack : String</td>
    <td>Stack type. Currently, only "dbcore" is supported.</td>
  </tr>
  <tr>
    <td>name : String</td>
    <td>Optional name of your middleware</td>
  </tr>
  <tr>
    <td>create : Function</td>
    <td>The middlware itself. It takes a DBCore instance and should return a modified DBCore instance.</td>
  </tr>
</table>

# Remarks

Your provided `create` function takes a [DBCore](/docs/DBCore/DBCore) and should return another plain JS object confirming to the [DBCore](/docs/DBCore/DBCore) interface.

# Example

```typescript
import Dexie from 'dexie';

const db = new Dexie('dbname');

db.use({
  stack: "dbcore", // The only stack supported so far.
  name: "MyMiddleware", // Optional name of your middleware
  create (downlevelDatabase) {
    // Return your own implementation of DBCore:
    return {
      // Copy default implementation.
      ...downlevelDatabase, 
      // Override table method
      table (tableName) {
        // Call default table method
        const downlevelTable = downlevelDatabase.table(tableName);
        // Derive your own table from it:
        return {
          // Copy default table implementation:
          ...downlevelTable,
          // Override the mutate method:
          mutate: req => {
            // Copy the request object
            const myRequest = {...req};
            // Do things before mutate, then
            // call downlevel mutate:
            return downlevelTable.mutate(myRequest).then(res => {
              // Do things after mutate
              const myResponse = {...res};
              // Then return your response:
              return myResponse;
            });
          }
        }
      }
    };
  }
});

```

In essence, all mutating operations are bulk-oriented. Theres only bulkPut(), bulkAdd(), bulkDelete() and deleteRange(). Currently all of these four are reached through a single method mutate().

Interface definitions for DBCore is found [here](https://github.com/dexie/Dexie.js/blob/master/src/public/types/dbcore.d.ts)

