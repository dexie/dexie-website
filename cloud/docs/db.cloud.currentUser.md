---
layout: docs-dexie-cloud
title: "db.cloud.currentUser"
---

An observable of [UserLogin](UserLogin)

### Example (React)

```tsx
import { useObservable } from "dexie-react-hooks";
import { db } from "./db.js";

function MyComponent() {
  const user = useObservable(db.cloud.currentUser);

  return (
    <>
      <p>Current User: {user.name}</p>
      <p>Is Logged in: {user.isLoggedIn}</p>
      <button onClick={() => db.cloud.login()}>Login</button>
    </>
  );
}
```

### Example (Svelte)

```html
<script>
  import { db } from "./db.js";

  function login() {
    db.cloud.login();
  }

  let oUser = db.cloud.currentUser;
</script>

<div>
  <p>Current User: {$oUser.name}</p>
  <p>Is Logged in: {$oUser.isLoggedIn}</p>
  <button on:click={login}>Login</button>
</div>
```

### Example './db.js' module (imported by the previous samples)

```js
import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

export const db = new Dexie("mydb", { addons: [dexieCloud] });
db.version(1).stores({
  things: "@id",
});

db.cloud.configure({
  databaseUrl: "https://xxxxxx.dexie.cloud",
});

```
