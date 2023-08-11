---
layout: docs
title: 'How To Use the StorageManager API'
---

<img src="/assets/images/disc.jpg" style="float:right;margin:24px;" />

Even though IndexedDB is a fully functional client-side database for the web, it is not a persistent storage by default. IndexedDB without [StorageManager](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager) is just a "best-effort" database that can be erased in situations of low disk space on a device. The browser may delete your database without notifying the user in case it needs to free up space for other website's data that was used more recently than yours.

Actually, this is a good thing for most cases as the end-users may not want everything to be stored forever on each site they visit. But if IndexedDB is critical for your application to work, this browser-behavior might scare you a bit.

If you are syncing your data with a server, this "best-effort" behavior might actually be ok to live with, as a resync would restore your data. But if you are not syncing, or require offline functionality after long periods of the app being not used (for example an offline music player), you should consider using the [StorageManager API](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager) to make sure your data is persisted.

## Controlling Persistence

If you need to prohibit the user from accidentally getting the data deleted, you should try putting the following code in your app's bootstrap somewhere:

```javascript

async function persist() {
  return await navigator.storage && navigator.storage.persist &&
    navigator.storage.persist();
}

```

This does not guarantee you be allowed to make the database "persistent" (in contrary of default "best-effort"). The browser may pop up a dialog to the user, asking for the permission to persist the storage and the user may say no. On many browsers without the StorageManager API the function will not do anything, as it initially checks for the existence of the StorageManager API and its persist method.

To check whether your IndexedDB database is successfully persisted, inspect the promise returned by `persist()`, or use the following function to query it without trying to persist:

```javascript

async function isStoragePersisted() {
  return await navigator.storage && navigator.storage.persisted &&
    navigator.storage.persisted();
}

```

Example of use:

```javascript

isStoragePersisted().then(async isPersisted => {
  if (isPersisted) {
    console.log(":) Storage is successfully persisted.");
  } else {
    console.log(":( Storage is not persisted.");
    console.log("Trying to persist..:");
    if (await persist()) {
      console.log(":) We successfully turned the storage to be persisted.");
    } else {
      console.log(":( Failed to make storage persisted");
    }
  }
})
```

## What is "storage" and how does it apply to Dexie?

Dexie is just a wrapper for IndexedDB and enables the creation of (and access to) client databases in your browser. StorageManager is a way to configure how IndexedDB will store its data for any database on your website or app. 

## Prohibit Unwanted Dialogs?

Using `navigator.storage.persist()` may prompt the end user for permission. Personally, I would not like a webapp to ask for a permission as the first thing it does. I would rather provide my own GUI to advertise that based on my app's criteria. For example, when the user seems to get more involved with the application, I could advertise and explain that the app might need to ensure that the data will not be accidentally cleared without user's notice. Or it could be turned on in a *Settings* menu for your app.

Chrome and Firefox also implement this differently. In Chrome, the "persistent" or "best-effort" mode is not decided by the end user but is based on how the user has interacted with the application, so it might actually be the case that your application is already allowed to be "persistent" without prompting the user for that permission. And the opposite - `persist()` may return false without ever prompting the user...

Luckily, the [Storage](https://storage.spec.whatwg.org) standard has taken into consideration the case when apps do not want to show dialogs initially as it is possible to convert existing storages to become persistent. There is also a [permissions](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions) API that lets you ask whether a certain permission needs to be prompted for or not. Users may have configured the browser to allow this already, or your app is run in installed mode and gets the permissions implicitly. See [Summary](#summary) for a sample on how to control user dialogs.


## How Much Data Can Be Stored?

If you successfully made your storage persistent, the quota it is allowed to use may vary depending on device. You might want to show your user how much storage is available, or you might want to take actions when storage reaches a certain percent of available storage. This can be accomplished using [StorageManager.estimate()](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate) as shown in the sample below:

```javascript

async function showEstimatedQuota() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimation = await navigator.storage.estimate();
    console.log(`Quota: ${estimation.quota}`);
    console.log(`Usage: ${estimation.usage}`);
  } else {
    console.error("StorageManager not found");
  }
}

```

## Eviction Limits
These limits are specific to each browser and its underlying data storage implementation. When the limit is reached, either non persistent data will get evicted, depending on persistence, or new data will fail to be written to the storage. 

When the browser tries to perform an operation that would cause the application to exceed its storage quota, it will throw a `DOMException` with a `QuotaExceededError` or similar depending on the browser.

More information regarding browser storage limits and eviction criteria can be found on the [Mozilla Developer Portal](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria)

## Caveats

Some things to consider:

* Your app must be served over HTTPS, as the StorageManager() is only available in a secure context.
* StorageManager API is still considered an experimental technology but is already available on Chrome, Firefox and Opera (as of October 30, 2017).

## Workers

Web Workers and Service Workers access the storage API the same way as web pages do - through `navigator.storage`.

## Summary

If you are storing critical data with Dexie (or in IndexedDB generally), you might consider using [StorageManager](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager) to ensure the data can be persistently stored, and not just "best-effort". For user experience, some apps may want to wait with enabling the persistent mode until the user seems to be repeatedly using the application, or maybe using certain parts of the application where persisted storage is critical.

In summary, here are some handy functions to use:

```javascript

/** Check if storage is persisted already.
  @returns {Promise<boolean>} Promise resolved with true if current origin is
  using persistent storage, false if not, and undefined if the API is not
  present.
*/
async function isStoragePersisted() {
  return await navigator.storage && navigator.storage.persisted ?
    navigator.storage.persisted() :
    undefined;
}

/** Tries to convert to persisted storage.
  @returns {Promise<boolean>} Promise resolved with true if successfully
  persisted the storage, false if not, and undefined if the API is not present.
*/
async function persist() {
  return await navigator.storage && navigator.storage.persist ?
    navigator.storage.persist() :
    undefined;
}

/** Queries available disk quota.
  @see https://developer.mozilla.org/en-US/docs/Web/API/StorageEstimate
  @returns {Promise<{quota: number, usage: number}>} Promise resolved with
  {quota: number, usage: number} or undefined.
*/
async function showEstimatedQuota() {
  return await navigator.storage && navigator.storage.estimate ?
    navigator.storage.estimate() :
    undefined;
}

/** Tries to persist storage without ever prompting user.
  @returns {Promise<string>}
    "never" In case persisting is not ever possible. Caller don't bother
      asking user for permission.
    "prompt" In case persisting would be possible if prompting user first.
    "persisted" In case this call successfully silently persisted the storage,
      or if it was already persisted.
*/
async function tryPersistWithoutPromtingUser() {
  if (!navigator.storage || !navigator.storage.persisted) {
    return "never";
  }
  let persisted = await navigator.storage.persisted();
  if (persisted) {
    return "persisted";
  }
  if (!navigator.permissions || !navigator.permissions.query) {
    return "prompt"; // It MAY be successful to prompt. Don't know.
  }
  const permission = await navigator.permissions.query({
    name: "persistent-storage"
  });
  if (permission.state === "granted") {
    persisted = await navigator.storage.persist();
    if (persisted) {
      return "persisted";
    } else {
      throw new Error("Failed to persist");
    }
  }
  if (permission.state === "prompt") {
    return "prompt";
  }
  return "never";
}


```

And to use it from your app:

```javascript

async function initStoragePersistence() {
  const persist = await tryPersistWithoutPromtingUser();
  switch (persist) {
    case "never":
      console.log("Not possible to persist storage");
      break;
    case "persisted":
      console.log("Successfully persisted storage silently");
      break;
    case "prompt":
      console.log("Not persisted, but we may prompt user when we want to.");
      break;
  }
}

```

If the result was "prompt" you could show your own view where you explain the reason for persistence along with a button to enable it.
When user presses the button, you call `navigator.storage.persist()`.


### References

[StorageManager on MDN](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager)

[Persistent Storage on developers.google.com](https://developers.google.com/web/updates/2016/06/persistent-storage)

[Limits and eviction criteria on MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria)

[Storage Standard](https://storage.spec.whatwg.org)
