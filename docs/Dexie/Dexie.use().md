---
layout: docs
title: 'Dexie.use()'
---

### Syntax

```javascript
db.use({stack, name?, create})
```

### Parameters
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

Your provided `create` function takes a [DBCore](https://github.com/dfahlander/Dexie.js/blob/master/src/public/types/dbcore.d.ts) and should return modified [DBCore](https://github.com/dfahlander/Dexie.js/blob/master/src/public/types/dbcore.d.ts). This could seem somewhat abstract, but in practice you can just clone the given DBCore and alter its `table` function to return your own version of `table`.

## 

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

Interface definitions for DBCore is found [here](https://github.com/dfahlander/Dexie.js/blob/master/src/public/types/dbcore.d.ts)

In this version, the CRUD hooks are called from a built-in middleware: [hooksMiddleware](https://github.com/dfahlander/Dexie.js/blob/v3.0.0-alpha.5/src/hooks/hooks-middleware.ts): A middleware that makes sure to call CRUD hooks in a backward compatible manner.

