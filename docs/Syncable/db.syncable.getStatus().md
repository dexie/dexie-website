---
layout: docs
title: 'db.syncable.getStatus()'
---

Get sync status for given URL

## Syntax

```javascript
db.syncable.getStatus(url)
```

## Return Value

[Promise&lt;number&gt;](/docs/Promise/Promise)

## Remarks

Returns a promise resolving with the sync status for given URL. If database is not open, the status OFFLINE (0) will be returned.

For a list of statuses, see [Dexie.Syncable.Statuses](/docs/Syncable/Dexie.Syncable.Statuses).
To map a status number to a string, use [Dexie.Syncable.StatusTexts](/docs/Syncable/Dexie.Syncable.StatusTexts).

## See also

[Dexie.Syncable.js](/docs/Syncable/Dexie.Syncable.js)

[Dexie.Syncable.Statuses](/docs/Syncable/Dexie.Syncable.Statuses)

[Dexie.Syncable.StatusTexts](/docs/Syncable/Dexie.Syncable.StatusTexts)

[db.syncable.list()](/docs/Syncable/db.syncable.list())
