---
layout: docs
title: 'Dexie.Syncable.registerSyncProtocol()'
---

## Syntax

```javascript
Dexie.Syncable.registerSyncProtocol (name, protocolInstance);
```

## Parameters

<table>
<tr><td>name : String</td><td>Name of your protocol</td></tr>
<tr><td>protocolInstance : <a href="Dexie.Syncable.ISyncProtocol">ISyncProtocol</a></td><td>Protocol Implementation</td></tr>
</table>

## Remarks

Register a synchronization protocol that adapts Dexie.Syncable to your server and database type.

## See also

[Dexie.Syncable.js](/docs/Syncable/Dexie.Syncable.js)
