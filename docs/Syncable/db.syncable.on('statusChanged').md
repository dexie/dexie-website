---
layout: docs
title: "db.syncable.on('statusChanged')"
---

Event that triggers when status is changed

## Syntax

```typescript
db.syncable.on('statusChanged', callback: (status, url) => void);
```

## Sample

```javascript
db.syncable.on('statusChanged', (status, url) => {
    console.log (`Url ${url} is now ${Dexie.Syncable.StatusTexts[status]}`);
});

/* Sample console output:

Url https://remote.server.com/syncRoute is now OFFLINE
Url https://remote.server.com/syncRoute is now CONNECTING
Url https://remote.server.com/syncRoute is now CONNECTED

*/
```

## See Also

[Dexie.Syncable.js](/docs/Syncable/Dexie.Syncable.js)
