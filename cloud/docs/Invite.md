---
layout: docs-dexie-cloud
title: "Invite"
---

Represents an invite for current user to join a realm. This object is obtained by subscribing to the [db.cloud.invites](dexie-cloud-addon#properties) observable.

An invite is member from the [members](db.members) table with attached properties `realm`, `accept()` and `reject()` properties. `realm` is a lookup from member.realmId to the actual realm object. `accept()` and `reject()` are methods / callbacks that can be used to accept or reject the realm. A user will only get the desired access after accepting the invite.

```ts
export interface Invite {
  id: string;
  realmId: string; // realmId being invited to.
  owner: string; // UserID of the owner of the `member` object that this invite represents
  userId?: string; // UserID of the person being invited
  email?: string; // email of the person being invited
  name?: string; // name of the person being invited
  invitedDate?: Date;
  invitedBy?: {
    name: string;
    email: string;
    userId: string;
  };
  roles?: string[]; // Roles to be given within the realm being invited to, if accepted.
  permissions?: DBPermissionSet; // Permissions being given in this realm by the invite.
  realm: {
    name: string; // Name of the realm
    represents: string; // A short explainer what this realm represents, such as "a to-do list", "a project", etc.
    owner: string; // UserID of Realm owner
    permissions: DBPermissionSet; // Current permissions in the realm (before accepting invite)
  };
  accept: () => Promise<void>; // Callback to accept this invite
  reject: () => Promise<void>; // Callback to reject this invite
}
```

## See also

[DBPermissionSet](DBPermissionSet)

[Role](Role)

[Realm](Realm)

[db.cloud.invites](db.cloud.invites)

[db.members](db.members)

[Access Control in Dexie Cloud](access-control)
