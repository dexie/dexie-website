---
layout: docs-dexie-cloud
title: "db.roles"
---

The `db.roles` table is added to the schema when having [dexie-cloud-addon](dexie-cloud-addon) applied. Roles can be imported [using the cli](cli#import-file-example-for-importing-roles) and then consumed using the [db.cloud.roles](db.cloud.roles) observable. It is of course also possible to query them using `db.cloud.toArray()` etc.

Roles can be used when sharing data with other users by adding an entry into the [members table](access-control#table-members) and set the roles attribute of the member.

Every object in this table is of type [Role](Role).

The primary key is a [compound](/docs/Compound-Index) key of `[realmId+name]`, meaning that for every realm, there could only be a single role name. Typical apps only add global roles. Global roles have their `realmId` property set to "rlm-public" and can be referred to from members of any realm. It is also possible to create roles local to a single realm, by setting the realmId to the realm it can be used in.

## See Also

[Role](Role)

[db.cloud.roles](db.cloud.roles)

[Access Control in Dexie Cloud](access-control)
