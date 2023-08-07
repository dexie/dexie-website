---
layout: docs
title: 'Dexie.Syncable.Statuses'
---

## Description

```typescript
enum SyncStatus {
    /** An irreparable error occurred and the sync provider is dead. */
    ERROR = -1,

    /** The sync provider hasn't yet become online, or it has been disconnected. */
    OFFLINE = 0,

    /** Trying to connect to server */
    CONNECTING = 1,

    /** Connected to server and currently in sync with server */
    ONLINE = 2,

    /** Syncing with server. For poll pattern, this is every poll call.
     * For react pattern, this is when local changes are being sent to server. */
    SYNCING = 3,

    /** An error occurred such as net down but the sync provider will retry to connect. */
    ERROR_WILL_RETRY = 4
}
```

## See also

[Dexie.Syncable.js](/docs/Syncable/Dexie.Syncable.js)
