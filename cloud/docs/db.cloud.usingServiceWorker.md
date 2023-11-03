---
layout: docs-dexie-cloud
title: "db.cloud.usingServiceWorker"
---

Reveals whether a service worker will be responsible of doing the sync requests towards Dexie Cloud Server or if it will be done in the main thread. This will depend on the configuration parameter [tryUseServiceWorker](<db.cloud.configure()#tryuseserviceworker>) and whether the current browser engine is supported to utilize service worker for sync events and whether a service worker was registered by your application.

There are benefits of letting a service worker do the sync requests but it is not required for the addon to work. A service worker can sync in the background, after you app has been closed or the user has put their device in pocket. In some browsers, service workers are also able to periodically sync a few times a day to keep the local database relatively updated also when not using the application.

In order to make a service worker take care of sync, you need to do the following steps:

1. Register a service worker for your application.
2. Let your service worker import dexie-cloud-addon's service worker module using `importScripts('dexie-cloud-addon/dist/umd/service-worker.[min].js)')`.
3. In your db module, configure db.cloud with [tryUseServiceWorker](<db.cloud.configure()#tryuseserviceworker>)

If all of these things are done and you run it in a compatible platform, the `db.cloud.usingServiceWorker` should be returning true after the db is open.

### Type

boolean
