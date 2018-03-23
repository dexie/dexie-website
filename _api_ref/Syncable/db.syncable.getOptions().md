---
layout: docs
title: 'db.syncable.getOptions()'
---

Get sync options for given URL

## Syntax

```javascript
db.syncable.getOptions(url, callback)
```

## Parameters
<table>
<tr><td>url: string</td><td>The URL to get the options for</td><td></td></tr>
<tr><td>callback: Function</td><td>function (options) { }</td><td><i>optional</i></td></tr>
</table>

## Callback Parameters
<table>
<tr><td>options: Object</td><td>The options of the given URL</td></tr>
</table>

## Return Value

[Promise&lt;options&gt;](/docs/Promise/Promise)

## Remarks

If the callback is omitted the returned Promise will resolve with the options for given URL, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If the callback is specified, it will be called with the options for the given URL and the returned Promise will resolve with the return value of given callback.

## See also

[Dexie.Syncable.js](/docs/Syncable/Dexie.Syncable.js)

