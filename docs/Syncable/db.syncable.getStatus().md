---
layout: docs
title: 'db.syncable.getStatus()'
---

Get sync status for given URL

## Syntax

```javascript
db.syncable.getStatus(url, callback)
```

## Parameters
<table>
<tr><td>url: string</td><td>The URL to get the status for</td><td></td></tr>
<tr><td>callback: Function</td><td>function (number) { }</td><td><i>optional</i></td></tr>
</table>

## Callback Parameters
<table>
<tr><td>status: number</td><td>The status of the given URL</td></tr>
</table>

## Return Value

[Promise&lt;number&gt;](/docs/Promise/Promise)

## Remarks

If the callback is omitted the returned Promise will resolve with the sync status for given URL, calling any [Promise.then()](Promise.then()) callback.

If the callback is specified, it will be called with the sync status for the given URL and the returned Promise will resolve with the return value of given callback.

Independent on whether you use a Promise to get the sync status or a callback, if the database is not open, the returned status will be the status OFFLINE (0).

For a list of statuses, see [Dexie.Syncable.Statuses](/docs/Syncable/Dexie.Syncable.Statuses).
To map a status number to a string, use [Dexie.Syncable.StatusTexts](/docs/Syncable/Dexie.Syncable.StatusTexts).

## See also

[Dexie.Syncable.js](/docs/Syncable/Dexie.Syncable.js)

[Dexie.Syncable.Statuses](/docs/Syncable/Dexie.Syncable.Statuses)

[Dexie.Syncable.StatusTexts](/docs/Syncable/Dexie.Syncable.StatusTexts)

[db.syncable.list()](/docs/Syncable/db.syncable.list())
