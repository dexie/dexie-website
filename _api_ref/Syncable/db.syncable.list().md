---
layout: docs
title: 'db.syncable.list()'
---

List remote URLs

## Syntax

```javascript
db.syncable.list()
```

## Return Value

[Promise&lt;string[]&gt;](/docs/Promise/Promise)

## Remarks
List remote URLs that we are connected or have been connected to. An URL will be listed even after disconnected. To remove an URL completely from this list, [db.syncable.delete(url)](/docs/Syncable/db.syncable.delete()) should be used.

To see the state of the URL, use [db.syncable.getStatus()](/docs/Syncable/db.syncable.getStatus())

## Example

```javascript
function listUrlsAndStatuses () {
    return db.syncable.list().then(urls => {
        return Promise.all(urls.map(
            url => db.syncable.getStatus(url)
                .then(status => ({url: url, status: status}));
    });
}

listUrlsAndStatuses().then(results) {
    results.forEach(x => {
        console.log(`URL: ${x.url}, status: ${Dexie.Syncable.StatusTexts[x.status]}`);
    }).catch (err => {
        console.error (`Error: ${err.stack || err}`);
    });
}
```
