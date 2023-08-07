---
layout: docs
title: 'Dexie.Syncable.IPersistentContext'
---

## Interface

```typescript
interface IPersistedContext {
    save(): Promise<void>;
}
```

## Description

Context that the [ISyncProtocol](/docs/Syncable/Dexie.Syncable.ISyncProtocol) implementer may use to store persistent state info within.

[ISyncProtocol](/docs/Syncable/Dexie.Syncable.ISyncProtocol) may store any custom properties on the persistedContext and call save() to persist them.

Typically, this context could be used to save an identifier for this particular local node against the remote node. The remote node may then mark the changes applied by this node so that those changes are ignored when sending back its changes to you. In case the local database is deleted, 

The context is saved in a special internal table within the same local database as you are syncing. If the database is deleted, so will you context be.

## Methods

### save()

Persist your context object to local database. When done, the returned promise will resolve. You may only store primitive types, objects and arrays in this context. You may not store functions or DomNodes.

#### Return Value
[Promise](/docs/Promise/Promise)
