---
layout: docs
title: 'Dexie.Syncable.ISyncProtocol'
---

Interface to implement for use with [Dexie.Syncable](/docs/Syncable/Dexie.Syncable.js).

## Interface

```typescript
interface ISyncProtocol {
    /** Maximum number of changes per sync() call. Default Infinity. */
    partialsThreshold?: number;

    /** Called by the framework to send changes to server and
     * receive changes back from server. */
    sync (
        context: IPersistedContext,
        url: string,
        options: Object,
        baseRevision: any,
        syncedRevision: any,
        changes: IDatabaseChange[],
        partial: boolean,
        applyRemoteChanges: ApplyRemoteChangesFunction,
        onChangesAccepted: ()=>void,
        onSuccess: (continuation: Continuation)=>void,
        onError: (error: any, again?: number) => void)
    : void;
}
```
If you are looking for a batteries-included solution, check out [Dexie Cloud](/cloud/).

Referred Types:

* [IPersistedContext](/docs/Syncable/Dexie.Syncable.IPersistedContext)
* [IDatabaseChange](/docs/Syncable/Dexie.Syncable.IDatabaseChange)
* [ApplyRemoteChangesFunction](#applyremotechanges--function-changes-lastrevision-partial-clear)
* [Continuation](#onsuccess--function-continuation)

*This interface is defined in [addons/Dexie.Syncable/api.d.ts](https://github.com/dfahlander/Dexie.js/blob/master/addons/Dexie.Syncable/api.d.ts)*

## Description

The interface to implement to enable sync with a remote database server. The remote database server may be SQL- or NOSQL based as long as it is capable of storing JSON compliant objects into some kind of object stores and reference them by a primary key.

The server must also be revision- and changes aware. This is something that for many databases needs to be implemented by a REST- or WebSocket gateway between the client and the backend database. 

## Sample Implementations

* [https://github.com/nponiros/sync_client](https://github.com/nponiros/sync_client)
* [AjaxSyncProtocol.js](https://github.com/dfahlander/Dexie.js/tree/master/samples/remote-sync/ajax/AjaxSyncProtocol.js)
* [WebSocketSyncProtocol.js](https://github.com/dfahlander/Dexie.js/tree/master/samples/remote-sync/websocket/WebSocketSyncProtocol.js)
 * with backend sample: [WebSocketSyncServer.js](https://github.com/dfahlander/Dexie.js/blob/master/samples/remote-sync/websocket/WebSocketSyncServer.js)

## Remarks

Implementors of ISyncProtocol may be independent on any framework. There are no dependencies to Dexie.js or Dexie.Syncable.js. Likewise, consumers of ISyncProtocol instance must not be just Dexie.Syncable, but could be used in other frameworks as well.

Some assumptions are made upon how the database is structured though. We assume that:
 * Databases has 1..N tables. (For NOSQL databases without tables, tables can be emulated using one DB per table)
 * Each table has a primary key.
 * The primary key is a UUID of some kind since auto-incremented primary keys are not suitable for syncronization (auto-incremented key would work but changes of conflicts would increase on create).
 * A database record is a JSON compatible object. For SQL databases, this can be accomplished using server-side JSON serializers to map between SQL columns and JSON properties.
 * Always assume that the client may send the same set of changes twice. For example if client sent changes that server stored, but network went down before client got the ack from server, the client may try resending same set of changes again. This means that the same Object Create change may be sent twice etc.
 * The implementation must not fail if trying to create an object with the same key twice, or delete an object with a key that does not exist.
 * Client and server must resolve conflicts in such way that the result on both sides are equal.
 * Since a server is the point of the most up-to-date database, conflicts should be resolved by prefering server changes over client changes. This makes it predestinable for client that the more often the client syncs, the more chance to prohibit conflicts.

## Parameters

### context : [IPersistedContext](/docs/Syncable/Dexie.Syncable.IPersistedContext)
A context that you may store persistent state within if you'd need to. You may set any custom properties on the context. The context is an arbritary document that will persist within the _syncNodes table in property 'syncContext'.

The same context instance will be given for all calls to sync() as long as the URL is the same. If calling context.save(), all properties stored on the context will be persisted in an internal table contained by the same database that is being synced.

An example on how to use this context can be found in: [WebSocketSyncProtocol.js](https://github.com/dfahlander/Dexie.js/blob/master/samples/remote-sync/websocket/WebSocketSyncProtocol.js).

### url : String
URL of the remote node to establish a continous sync with.

### options : Object
Additional information from caller. Example of options could be timeout settings, poll intervals, authentication credentials, etc. The options are optional and implementation specific. Options maps to the 'options' parameter in [db.syncable.connect()](/docs/Syncable/db.syncable.connect())

### baseRevision

Server revision that the changes are based on. Should be used when resolving conflicts. On initial sync, this value will be null. If having synced before, this will one of the values that has been sent previously to [applyRemoteChanges()](#applyremotechanges--function-changes-lastrevision-partial-clear), but not nescessarily the last value. baseRevision is persisted so it will survive a reboot.

A revision can be of any JS type (such as Number, String, Array, Date or Object). Remote node should use this value to know if there are conflicts. If changes on the remote node was made after this revision, and any of those changes modified the same properties on the same objects, it must be considered a conflict and the remote node should resolve that conflict by choosing the remote node's version of the conflicting properties unless it is a conflict where client has deleted an object that server has updated - then the deletion should win over the update. An implementation of this rule is defined in WebSocketSyncServer.js: function resolveConflicts().

### syncedRevision

Server revision that local database is in sync with already. On initial sync, this value will be null. If having synced before, this will be the same value that were previously sent by the sync implementor to [applyRemoteChanges()](#applyremotechanges--function-changes-lastrevision-partial-clear). syncedRevision is persisted so even after a reboot, the last value will be remembered. A revision can be of any JS type (such as Number, String, Array, Date or Object).

Server should use this value to know which changes to send to client. Server should only send changes occurred after given syncedRevision.

The difference between baseRevision and syncedRevision is:
 * baseRevision: revision that given 'changes' array are based upon. Should be used by remote node when resolving conflicts.
 * syncedRevision: revision that local node has already applied. Should be used by remote node when filtering which changes to send to local node.

### changes : Array<[IDatabaseChange](/docs/Syncable/Dexie.Syncable.IDatabaseChange)>

Local changes to sync to remote node. This array will contain changes that has occurred locally since last sync. If this is the initial sync, framework will want to upload the entire local database to the server. If initial sync or if having been offline for a while, local database might contain much changes to send. Of those reasons, it is not guaranteed that ALL client changes are delivered in this first call to sync(). If number of changes are 'enormous', the framework may choose to only apply a first chunk of changes and when onSuccess() is called by your implementation, framework will send the remaining changes by calling sync() again, or continuation.react depending on the continuation method given in the call to onSuccess().

The argument 'partial' will tell whether all changes are sent or if it is only a partial change set. See parameter 'partial'. Note that if partial = true, your server should queue the changes and not commit them yet but wait until all changes have been sent (partial = false).

### partial

If true, the changes only contains a part of the changes. The part might be cut in the middle of a transaction so the changes must not be applied until another request comes in from same client with partial = false. A sync server should store partial changes into a temporary storage until the same client sends a new request with partial = false. For an example of how to hande this, see WebSocketSyncServer.js under [samples/remote-sync/websocket](https://github.com/dfahlander/Dexie.js/tree/master/samples/remote-sync/websocket/).

As of dexie-syncable@^1.0.0-beta.1, *partial* can only ever become true if your ISyncProtocol.partialThreshold was defined as a number less than Infinity.

### applyRemoteChanges : function (changes, lastRevision, partial, clear)

Call this function whenever the response stream from the remote node contains new changes to apply. Provide the array of IDatabaseChange objects as well as the revision of the last change in the change set. If there are enormous amount of changes (would take too much RAM memory to put in a single array), you may call this function several times with 'partial' set to true until the last set of changes arrive. The framework will not commit the changes until method is called with partial = false or undefined.

The 'clear' argument is another optional Boolean. As of current version (0.9.1), this flag has no effect yet. The intent is that if the flag is set, the framework should clear all existing data before applying changes. This flag could be useful in case the given baseRevision was too old for the server. Server may have cleared out old revisions to save space and if clients come in with a baseRevision older than the earliest revision known by server server may set this flag and provide a changes array of CREATEs only for all objects in the database.

#### Parameters to applyRemoteChanges()
 
 * changes : Array<[IDatabaseChange](/docs/Syncable/Dexie.Syncable.IDatabaseChange)> - Remote changes to apply locally
 * lastRevision : **_any_** - Revision of last change in given changes.
 * partial : Boolean - If true, framework wont commit these changes yet
 * clear : Boolean - Not yet used. In future version, when this flag is true, framework will clear all local data prior to applying changes.

### onChangesAccepted : function ()

Call this function when you get an ack from the server that the changes has been recieved. Must be called no matter if changes were partial or not partial. This will mark the changes as handled so that they need not to be sent again to the particular remote node being synced.

### onSuccess : function (continuation)

Call this function when all changes you got from the server has been sent to applyRemoteChanges(). Note that not all changes from client has to be sent or acked yet (nescessarily).

 * Sample when using a poll strategy:

```javascript
onSuccess({again: 1000});
```

 * Sample when using an immediate reaction strategy:

```javascript
onSuccess({
    react: function (changes, baseRevision, partial, onChangesAccepted) {
        // Send changes, baseRevisoin and partial to server
        // When server acks, call onChangesAccepted();
    },
    disconnect: function () {
        // Disconnect from server!
    }
});
```

The given continuation object tells the framework how to continue syncing. Possible values are:
 * `{ again: milliseconds }` - tells the framework to call sync() again in given milliseconds.
 * `{ react: onLocalChanges, disconnect: disconnectFunction }` - tells the framework that you will continue listening on both client- and server changes simultanously. When you get changes from server, you will once again call applyRemoteChanges() and when client changes arrive, you will get notified in your 'react' function: function (changes, baseRevision, partial, onChangesAccepted). When the framework want to close down your provider, it will call your provided disconnect function. Note that the disconnect function is only required when using the 'react' pattern. This is because the 'again' pattern is always initiated by the framework.

Note that onSuccess() must only be called once. If continuing using the 'react' pattern, you will no more call onSuccess(). (If using the 'again' pattern, the next call will be to sync() again and thus the same implementation as initial sync and therefore you must call onSuccess() again).

Note also that the onChangesAccepted callback provided in your react() function is not the same as the onChangesAccepted() provided in your main sync() method and they must not be mixed. The onChangesAccepted() in sync() should be called when the changes array in sync() has been accepted by remote server, while the onChangesAccepted() in react() should be called when the changes array in react() has been accepted by remote server. Please review [WebSocketSyncProtocol.js](https://github.com/dfahlander/Dexie.js/tree/master/samples/remote-sync/websocket/WebSocketSyncProtocol.js) where this is implemented.

### onError : function (err, again)

Call this function if an error occur. Provide the error object (exception or other toStringable object such as a String instance) as well as the again value that should be number of milliseconds until trying to call sync() again. For repairable errors, such as network down, provide a value for again so that the framework may try again later. If the error is non-repairable (wouldnt be fixed if trying again later), you should provide Infinity, null or undefined as value for the again parameter.

If an error occur while listening for server changes after having gone over to the 'react' pattern, you may also call onError() to inform the framework that the remote node has gone down. If doing so, your sync call will be terminated and you will no longer recieve any local changes to your 'react' callback. Instead you inform the framework about the number of milliseconds until it should call sync() again to reestablish the connection.
