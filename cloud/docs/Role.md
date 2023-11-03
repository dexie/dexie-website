---
layout: docs-dexie-cloud
title: "Role"
---

Object interface for [db.roles](db.roles) table.

```ts
interface Role {
  realmId: string;
  name: string;
  permissions: DBPermissionSet;
  description?: string;
  displayName?: string;
  sortOrder?: number;
}
```

## See Also

[DBPermissionSet](DBPermissionSet)
