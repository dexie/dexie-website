---
layout: docs
title: 'db.syncable.delete()'
---

Stop syncing and delete all sync state for given URL.

## Syntax

```javascript
db.syncable.delete(url);
```

## Remarks
Similar to db.syncable.disconnect() but also deletes all stored state about the endpoint such as remote base revision, synced revision and local revision that server has in sync.

Only call this when you will never sync with the server again. If you do db.syncable.connect() with the server after having deleted it, a full sync will be done - and the local database may be entirely replaced by the server's database. Changes that has happened locally in between will be lost.

