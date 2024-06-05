---
layout: docs
title: 'Consistent replacePrefix() operator'
---

### Syntax

```ts
import { replacePrefix } from 'dexie';

db.files
  .where('filePath')
  .startsWith('foo/')
  .modify({
    filePath: replacePrefix('foo/', 'bar/')
  });
```

### Description

Performs a sync-consistent replacement of the leading parts of a string. The operation can be performed in order to consistently move sub trees when syncing data using [Dexie Cloud](/cloud).

### Consistency use cases

Client A and Client B shares a copy of a Dexie Cloud database with a tree structure. The tree structure is defined using the indexed `filePath` property. A network outage happens for both clients. At the time of the network outage both clients have identical copies of the tree:

```
foo/
    item1
    item2
    item3
```

Now both clients are off-line for a while and while they are offline they perform different actions:

- Client A adds `item4` with filePath `foo/`.
- Client B renames filepath `foo/` to `bar/` using `replacePrefix()` the same way as in the sample from [syntax](#syntax) above.

Network is then repaired for both clients.

If Client A syncs first:

1. Client A syncs. The canonical data is now:

   ```
   foo/
       item1
       item2
       item3
       item4
   ```

2. Client B syncs. The consistent `replacePrefix` operation is executed server-side. Result:

   ```
   bar/
       item1
       item2
       item3
       item4
   ```

If instead Client B would have synced first:

1. Client B syncs. The consistent `replacePrefix` operation is executed server-side and also persisted in the change log, in case another client based on previous revision will sync things later.

   ```
   bar/
       item1
       item2
       item3
   ```

2. Client A syncs the addition of `{filePath: 'foo/', name: 'item4'}` (based on an earlier state of the data). Since the base revision number is part of the sync request, server detects that a consistent operation has to be executed onto the data that client A wants to add to the database. The new object `{filePath: 'foo/', name: 'item4'}` is therefore transformed into `{filePath: 'bar/', name: 'item4'}`. Result:

   ```
   bar/
       item1
       item2
       item3
       item4
   ```

### See Also

[add()](<add()>)

[remove()](<remove()>)
