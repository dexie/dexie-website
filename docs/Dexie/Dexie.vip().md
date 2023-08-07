---
layout: docs
title: 'Dexie.vip()'
---

### Sample

```javascript
db.on('ready', function() {
    return new Dexie.Promise(function (resolve, reject) {
        // At this point we are still VIP:ed, but if we use an asynchronous
        // api without encapsulating it in another Dexie.Promise, we will
        // loose our VIP status. One example is when using setTimeout():
        setTimeout(function(){
            // Here we are no longer auto-VIP:et
            // If we don't VIP ourselves here, database will be blocked for
            // us because it is waiting for ourselves to finish! Deadlock will occur!
            db.vip(function () {
                // Make db calls here will ignore the blocked state of db:
                db.friends.put({name: "Urban"}).then(resolve).catch(reject);
            });
        }, 0);
    });
});
```

### Description

Method to be used by subscribers to the on('ready') event. This will let caller through to access DB even when it is blocked while the db.ready() subscribers are firing. 

Note that this method is only useful for on('ready') subscribers that is returning a Promise from the event. If not using vip() the database could deadlock since it wont open until the returned Promise is resolved, and any non-VIPed operation started by the caller will not resolve until database is opened.

Sequence of Database Open:

<table>
<tr><td>1. Dexie.open() is called</td></tr>
<tr><td>2. backend IDB opens DB</td></tr>
<tr><td>3. backend IDB.onsuccess is fired</td></tr>
<tr><td>4. on('ready') is firing</td></tr>
<tr><td>5. Waiting for returned Promise from on('ready') subscriber</td></tr>
<tr><td>6. All on('ready') subscribers' Promises are resolved</td></tr>
<tr><td>7. The 'blocked' state is cleared and any pending requests are resumed.</td></tr>
</table>

When the on('ready') event is fired, the subscriber will be VIP:ed initially, meaning that the 'blocked' state will be ignored if it needs to do any db operations. Any Promise that it creates directly or indirectly will also derive the VIP status. So will also any then() callback from the promise do. This means that it is normally not needed to use the vip() method. But if the subscriber calls an external API without encapsulating it in a Dexie [Promise](/docs/Promise/Promise), the callback will loose its VIP status.

The VIP state is maintained using a Promise Specific Data structure, [Promise.PSD](/docs/Promise/Promise.PSD) which works the same way for promises as Thread-Specific-Data (TSD) does for threads. The PSD will be derived by any Promise created and in any then(), catch() or finally() method called back from the [Promise](/docs/Promise/Promise).

### Solving Above Sample Without vip()

The following sample solves the deadlock issue without using the vip() method. Note that it does the same thing as the sample on the top of this page but since it surrounds the external setTimeout() call with a Promise, the VIP status will remain in the then() method of the Promise.

```javascript
db.on('ready', function() {
    return new Dexie.Promise(function (resolve, reject) {
        // At this point we are still VIP:ed, but if we use an asynchronous
        // api without encapsulating it in another Dexie.Promise, we will
        // loose our VIP status. One example is when using setTimeout():
        setTimeout(function(){
            resolve();
        }, 0);
    }).then(function() {
        // Since we are executing in the then() clause of an already VIP:ed
        // Promise, we don't need to VIP ourselves here.
        return db.friends.put({name: "Urban"});
    });
});
```

### Situations in which vip() is required

As shown in the above example, it was not required to call vip() in the setTimeout() sample since we could workaround it by letting the async callback call resolve() and then follow it up in the then() method instead. But there might be more complex situations when working with various asynchronous APIs where vip() could be handy.

