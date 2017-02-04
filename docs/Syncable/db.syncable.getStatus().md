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

[Promise&lt;number&gt;](Promise)

## Remarks
Returns a promise resolving with the sync status for given URL. If database is not open, the status OFFLINE (0) will be returned.

For a list of statuses, see [Dexie.Syncable.Statuses](Dexie.Syncable.Statuses).
To map a status number to a string, use [Dexie.Syncable.StatusTexts](Dexie.Syncable.StatusTexts).

## See also

[Dexie.Syncable.js](Dexie.Syncable.js)

[Dexie.Syncable.Statuses](Dexie.Syncable.Statuses)

[Dexie.Syncable.StatusTexts](Dexie.Syncable.StatusTexts)

[db.syncable.list()](db.syncable.list())

