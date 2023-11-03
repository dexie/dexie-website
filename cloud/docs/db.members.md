---
layout: docs-dexie-cloud
title: "db.members"
---

The `db.members` table is added to the schema when having [dexie-cloud-addon](dexie-cloud-addon) applied. Each member object gives access to a certain user within a certain realm with certain permissions. See [Access Control in Dexie Cloud](access-control).

Every object in this table is of type [Member](Member).

Members can be created in order to invite users to a realm. The member will the be visible for the invited user through the [db.cloud.invites](db.cloud.invites) property and if the `invite` property is set, the user will also get an email with the invite and links to accept or reject it. The `userId` property should not be set when creating members - it will be set when the user accepts the member. However, if adding members via the REST API, an application can bypass the invite step and directly give access to users within realms.

The primary key is `id`, which is a globally unique string prefixed with 'mmb'.

## See Also

[Member](Member)

[db.cloud.invites](db.cloud.invites)

[Access Control in Dexie Cloud](access-control)
