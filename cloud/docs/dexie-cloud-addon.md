---
layout: docs-dexie-cloud
title: "dexie-cloud-addon"
---

## Installation

#### Create a database

```
npx dexie-cloud create
```

#### Install dexie-cloud-addon
```
npm install dexie-cloud-addon
```

## Usage


```tsx
import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon"; // Import the addon

const db = new Dexie("mydb", {
  addons: [dexieCloud], // Include addon in your Dexie instance
});

db.version(1).stores({
  myTable: "@myId, myIndex1, myIndex2, ...",
});

db.cloud.configure({
  databaseUrl: "https://xxxxxxx.dexie.cloud", // URL from `npx dexie-cloud create`
  ...otherOptions,
});
```

## API
### Methods

| Method                                         | Description                                                                                                          |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [db.cloud.configure()](<db.cloud.configure()>) | Connect your client to the cloud                                                                                     |
| db.cloud.login()                               | Authenticate user. Useful in combination with option `{requireAuth: false}`                                          |
| db.cloud.sync()                                | Force a sync. Useful in combination with option `{disableWebSocket: true}`                                           |
| [db.cloud.permissions()](db.cloud.permissions())                         | Observe access permissions for given object - see also [usePermission()](</docs/dexie-react-hooks/usePermissions()>) |

<br>

### Properties

| Property                                     | Type                                                                                            | Description                                                                                                                                                               |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| db.cloud.version                             | string                                                                                          | Version of dexie-cloud-addon                                                                                                                                              |
| db.cloud.options                             | [DexieCloudOptions](DexieCloudOptions)                                                          | Options configured using db.cloud.configure()                                                                                                                             |
| db.cloud.schema                              | [DexieCloudSchema](DexieCloudSchema)                                                            | Dexie-Cloud specific schema (complementary to dexie schema)                                                                                                               |
| db.cloud.currentUserId                       | string                                                                                          | UserID of the currently logged in user                                                                                                                                    |
| [db.cloud.currentUser](db.cloud.currentUser) | [Observable](https://rxjs.dev/guide/observable)&lt;[UserLogin](UserLogin)&gt;                   | Observable of currently logged in user.                                                                                                                                   |
| db.cloud.webSocketStatus                     | [Observable](https://rxjs.dev/guide/observable)&lt;string&gt;                                   | Observable of websocket status: "not-started", "connecting", "connected", "disconnected" or "error"                                                                       |
| db.cloud.syncState                           | [Observable](https://rxjs.dev/guide/observable)&lt;[SyncState](SyncState)&gt;                   | Observable of sync state                                                                                                                                                  |
| db.cloud.userInteraction                     | [Observable](https://rxjs.dev/guide/observable)&lt;[DXCUserInteraction](https://github.com/dfahlander/Dexie.js/blob/194abe82b6dc5c073652e5e86a1eed4d984a05a0/addons/dexie-cloud/src/types/DXCUserInteraction.ts)&gt; | Observable of login GUI. Use in combination with option `{customLoginGui: true}`                                                                                          |
| db.cloud.invites                             | [Observable](https://rxjs.dev/guide/observable)&lt;[Invite[]](Invite)&gt;                       | Observable of invites from other users to their realms                                                                                                                    |
| db.cloud.roles                               | [Observable](https://rxjs.dev/guide/observable)&lt;[Invite[]](DBRealmRole)&gt;                  | Observable of global roles in your database (a liveQuery of db.roles of the global realm))                                                                                |
| usingServiceWorker                           | boolean                                                                                         | Whether service worker is used or not. Depends on a combination of config options and whether a service worker that imports dexie-cloud's service worker module was found |

## Consuming [Observable&lt;T&gt;](https://rxjs.dev/guide/observable)

Many properties in db.cloud are Observables and the method [db.cloud.permissions()](db.cloud.permissions()) returns an Observable.
Observables represents reactive data and allows your app to subscribe to them and re-render whenever they emit a value.
Observables can be consumed in any GUI framework and we give two samples below.

### Example (React)

```tsx
import { useObservable } from "dexie-react-hooks";
import { db } from "./db.js";

function MyComponent() {
  // db.cloud.invites is an Observable of Invite[] array.
  const invites = useObservable(db.cloud.invites);

  return (
    <>
      <h1>Invites</h1>
      <ul>
        {invites.map((invite) => (
          <li key={invite.id}>
            You are invited to act as {invite.roles?.join(", ")}
            in the realm {invite.realm.name}
            
            <button onClick={() => invite.accept()}>Accept</button>
            <button onClick={() => invite.reject()}>Reject</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

This component would render the current invites for your user at any time and re-render whenever an invite is added, updated or removed.

See [useObservable()](/docs/dexie-react-hooks/useObservable())

### Example (Svelte)

```html
<script>
  import { db } from "./db.js";

  let oInvites = db.cloud.invites;
</script>

<div>
  <h1>Invites</h1>
  {#each $oInvites as invite (invite.id)}
    <li>{invite.realm.name}</li>
  {/each}
</div>
```

For more samples, see also [db.cloud.currentUser](db.cloud.currentUser) and [db.cloud.permissions()](db.cloud.permissions())


