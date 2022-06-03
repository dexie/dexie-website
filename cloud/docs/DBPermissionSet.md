---
layout: docs-dexie-cloud
title: "DBPermissionSet"
---

Represents permissions in Dexie Cloud

```ts
export interface DBPermissionSet {

  /** Permission to add objects into given tables
   */
  add?: "*" /* all tables */ | string[];

  /** Permission to update given properties in given tables.
   *  
  */
  update?:
    | "*" // all tables
    | {
        [tableName: string]: string[] /* property list */ | "*" /* all properties */ ;
      };

  /** Full permission within given tables, including deleting objects that you do not own.
   * 
  */
  manage?: "*" | string[];
}
```

See also the [Permissions](access-control#permissions) section on the Access Control page that describes the permissions.
