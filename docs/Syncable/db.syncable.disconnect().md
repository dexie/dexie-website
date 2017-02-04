---
layout: docs
title: 'db.syncable.disconnect()'
---

Stops syncing with given url.

## Syntax

```javascript
db.syncable.disconnect(url);
```

## Remarks

Suspend syncing with the remote server at given URL but keep the sync state to be prepared for resuming sync again using [db.syncable.connect()](/docs/Syncable/db.syncable.connect()).

