---
layout: docs-dexie-cloud
title: "db.cloud.invites"
---

### Type

Observable of [Invite](Invite)

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

See [useObservable()](</docs/dexie-react-hooks/useObservable()>)

### Example (Svelte)

```svelte
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

### See Also

[db.cloud properties](dexie-cloud-addon#properties)
