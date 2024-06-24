---
layout: docs-dexie-cloud
title: "db.cloud.roles"
---

Retrieve the list of available roles for your application. Roles can be imported [using the cli](cli#import-file-example-for-importing-roles) and then consumed by the application using this property.

The property is an observable. See Examples below for how to consume it.

Roles can be used when sharing data with other users by adding an entry into the [members table](access-control#table-members) and set the roles attribute of the member.

### Type

Observable of {[roleId: string]: [Role](Role)}

### Example (React)

```tsx
import { useObservable } from "dexie-react-hooks";
import { db } from "./db.js";

function MyComponent() {
  const roles = useObservable(db.cloud.roles);

  return (
    <>
      <h1>Roles</h1>
      <ul>
        {Object.keys(roles).map((roleId) => (
          <li key={roleId}>{roles[roleId].displayName}</li>
        ))}
      </ul>
    </>
  );
}
```

This component would render the current roles

See [useObservable()](</docs/dexie-react-hooks/useObservable()>)

### Example (Svelte)

```svelte
<script>
  import { db } from "./db.js";

  let oRoles = db.cloud.roles;
</script>

<div>
  <h1>Roles</h1>
  {#each Object.keys($oRoles) as roleId}
    <li>{$oRoles[roleId].displayName}</li>
  {/each}
</div>
```

### See Also

[db.cloud properties](dexie-cloud-addon#properties)
