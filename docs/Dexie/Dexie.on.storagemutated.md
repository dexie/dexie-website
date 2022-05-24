---
layout: docs
title: 'Dexie.on.storagemutated'
---

### Syntax

```ts
const listener = (changedParts: ObservabilitySet) => {
    console.log("Changed parts", changedParts);
};
// Subscribe:
Dexie.on("storagemutated", listener);
// Unsubscribe:
Dexie.on("storagemutated").unsubscribe(listener);
// Trigger:
Dexie.on("storagemutated").fire(changeParts: ObservabilitySet);
```

### Description

This static event "storagemutated" is a global low-level event that is being fired whenever a write transaction has committed. The event is comprises the groundword for [liveQuery()](/docs/liveQuery()) and [useLiveQuery()](/docs/dexie-react-hooks/useLiveQuery()). Event will fire no matter where a write transaction did commit - within same window or on another window / tab / web worker / shared worker or service worker as long as it was performed using dexie version version 3.2 or later.

Developers normally does not need to use this event directly. This documentation is meant to explain how it can be used to get notified of database mutations in indexedDB. The provided ObservabilitySet will not reveal the exact changes made, but only pin-point which indexes and primary keys that may have been affected by the change. This information can be used to compute whether a certain query would have been affected by the change or not.

### ObservabilitySet

```ts
/** Set of mutated parts of the database
 */
export type ObservabilitySet = {
  /** Database part having been mutated.
   * 
   * This structure is produced in observability-middleware.ts
   * and consumed in live-query.ts.
   * 
   * Format of 'part':
   * 
   *   `idb://${dbName}/${tableName}/${indexName}`
   * 
   * * dbName is the database name
   * * tableName is the table name
   * * indexName is any of:
   *    1. An empty string - represents the primary keys of the affected objs
   *    2. ":dels" - represents primary keys of deleted objects in the table
   *    3. The keyPath of an index, such as "name", "age" or "address.city" -
   *       represents indexes that, if used in a query, might affect the
   *       result of that query.
   * 
   * IntervalTree
   *    * See definition of IntervalTree type in rangeset.d.ts
   *    * See rangesOverlap() in rangeset.ts that can be used to compare two
   *      IntervalTrees and detect collissions.
   *    * See RangeSet class that can be used to create an IntervalTree and add
   *      ranges to it.
   */
  [part: string]: IntervalTree;
};

```

### Limitations

For this event to fully propagate mutations performed within Web Workers, the browser needs to support [BroadcastChannel API](https://caniuse.com/broadcastchannel). This API is supported by all modern browsers as of may 2022, but recent versions of Safari (<= version 15.3) did not support this API. Dexie does have a workaround for propagating changes from Service workers in older Safari browsers but not from ordinary Web Workers.

### Supporting Safari 15.3 and below

Safari 15.3 and older works fine with this event only when mutations and subscribtion are performed in windows, tabs or service workers. Dexie has built-in workarounds for Safari <= 15.3 where BroadcastChannel support is missing to support change propagation between tabs/windows and from service workers to its clients. However, if you are writing to a database in a Web Worker and want your live queries in the browser to react on in, you will need a custom workaround if you need it to work also for Safari 15.3 and older:

**worker:**
```ts
// In Worker:
if (typeof BroadcastChannel === 'undefined') {
  Dexie.on('storagemutated', updatedParts => {
    postMessage({type: "storagemutated", updatedParts});
  });
}
```

**web:**
```ts
// In Web:
if (typeof BroadcastChannel === 'undefined') {
  myWorker.addEventListener('message', event => {
    if (event.data.type === 'storagemutated') {
      Dexie.on('storagemutated').fire(event.data.updatedParts);
    }
  });
}
```

This custom workaround only support one-way propagation from Web Workers to their openers and assumes `liveQuery()` or `useLiveQuery` is used in the GUI parts of your app only. It is possible to do a bi-directional workaround as well if your Web Workers uses `liveQuery()` for some reason. See [https://github.com/dexie/Dexie.js/issues/1573#issuecomment-1135911114](https://github.com/dexie/Dexie.js/issues/1573#issuecomment-1135911114).

