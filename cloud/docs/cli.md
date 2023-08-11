---
layout: docs-dexie-cloud
title: "Dexie Cloud CLI"
---

The Dexie Cloud command-line interface `dexie-cloud` is an executable npm package. It is the CLI for creating and managing sync databases. You do not have to install the package to use it. The only prerequisite is having node.js installed on your system. The `npx` tool that comes with Node.js will download it temporarily from npm when you run any dexie-cloud command, such as `npx dexie-cloud --help`.

## create

Creates a database in the cloud.

**cd** to the root directory of your web app and write:

<pre>
npx dexie-cloud create [--service &lt;URL&gt;]
</pre>

This command creates a new database in the cloud. You will be prompted for your email address and receive an email with the one-time password (OTP) to enter into the next prompt. Once the database has been created, your will also get two files stored in the same directory as you stand in.

| dexie-cloud.json | Contains the URL to your new database |
| dexie-cloud.key | Contains the client ID and secret for further CLI commands |

Neither of these files should be added to git as they represent environment rather than source. It is especially important to not add the .key file as it contains the secret.
The files are not needed for the web app to work - they are only useful if you want to run other CLI commands, like white-listing new apps etc. They can also be used to access the Dexie Cloud REST API from a server.

Your email will be stored in the database as the database owner.

#### Options

```
--service <URL>  Create database on custom server (default is https://dexie.cloud)
```

#### Sample

```
$ npx dexie-cloud create
Enter your email address: youremail@company.com
Enter OTP: YourOTP
Creating database...
Successfully created new database!

We created two new local files for you:
=======================================
dexie-cloud.json - URL to database
dexie-cloud.key - contains client ID and secret
```

#### Files to be listed in .gitignore

```
dexie-cloud.json
dexie-cloud.key
```

## databases

List the databases you have credentials for in your dexie-cloud.key file.
Can be handy when switching between multiple databases. The list shows which one of the databases that is currently selected.
To switch to another database, use `npx dexie-cloud connect <DB-URL>`.

#### Sample

```
$ npx dexie-cloud databases
https://z7sk70jbj.dexie.cloud
https://zdmrn79uu.dexie.cloud <--current

$ npx dexie-cloud connect https://z7sk70jbj.dexie.cloud
Current database is now https://z7sk70jbj.dexie.cloud (stored in dexie-cloud.json)

$ npx dexie-cloud databases
https://z7sk70jbj.dexie.cloud <--current
https://zdmrn79uu.dexie.cloud

```

## authorize

Authorizes another user to manage the database.

<pre>
npx dexie-cloud authorize &lt;email address&gt; [--scopes &lt;scopes&gt;]
</pre>

Authorizing a user will create an API client for that user with its own client ID and secret. The authorized user may then connect to the same database using the [connect](#connect) command.

To list authorized users, use the [clients](#clients) command.

#### Scopes

| Scope        | Meaning                                                    |
| ------------ | ---------------------------------------------------------- |
| IMPERSONATE  | Client may be used to issue tokens to arbritary users      |
| ACCESS_DB    | Sync, read and write to database respecting access control |
| MANAGE_DB    | Manage database clients                                    |
| GLOBAL_READ  | Read entire database from any realm                        |
| GLOBAL_WRITE | Write in entire database                                   |
| DELETE_DB    | Delete the database                                        |
| \*           | Represents all scopes                                      |

## unauthorize

Remove API clients that belong to given email address. Any authorized database manager can add and remove authorization.

<pre>
npx dexie-cloud unauthorize &lt;email address&gt;
</pre>

You can unauthorize yourself only if there are other authorized clients. A database must have at least one API client.
To see a list of authorized database managers, see the [clients](#clients) command.

## revoke

Remove individual API client.

<pre>
npx dexie-cloud revoke &lt;client ID&gt;
</pre>

You can unauthorize you own client only if there are other authorized clients with enough scopes to fully manage the database and be able to delete it. A database must have at least one API client with all scopes applied.
To see a list of authorized database managers, see the [clients](#clients) command.

## clients

List API clients along with their owner email-addresses.

## connect

Request client_id and client_secret for an existing db and save them into dexie-cloud.key. Also set active database in dexie-cloud.json. This command will require email OTP verification before retrieving credentials and the OTP receiver must have been authorized to manager the database using the [npx dexie-cloud authorize](#authorize) command, or be the creator of the database.

<pre>
npx dexie-cloud connect &lt;Database URL&gt;
</pre>

#### Sample

```
$ npx dexie-cloud connect https://zrp8lv7rq.dexie.cloud
Enter your email address: youremail@company.com
Enter OTP: YourOTP
Successful client confirmation.

Local files have been updated:
==============================
dexie-cloud.json - URL to database
dexie-cloud.key - contains client ID and secret
```

#### Files to be listed in .gitignore

```
dexie-cloud.json
dexie-cloud.key
```

## delete

Deletes a database from the cloud. The database gets marked for deletion and goes into a grace period of 1 month before it is completely removed from the system. During that month, clients that connect to the database receives a warning notice about the deletion along with the final deletion date. The deletion can be undone using the [undelete](#undelete) CLI command by any authorized DB manager.

<pre>
npx dexie-cloud delete &lt;Database-URL&gt;
</pre>

## undelete

Un-deletes a previously deleted database. Only works within the grace period, see [delete](#delete).

#### Example

```
$ npx dexie-cloud delete https://841ba920.dexie.cloud
No credentials for https://841ba920.dexie.cloud was found in dexie-cloud.key.
Use `npx dexie-cloud connect https://841ba920.dexie.cloud` and then retry.

$ npx dexie-cloud connect https://841ba920.dexie.cloud
Enter your email address: youremail@company.com
Enter OTP: YourOTP
Successful client confirmation.

Local files have been updated:
==============================
dexie-cloud.json - URL to database
dexie-cloud.key - contains client ID and secret

$ npx dexie-cloud delete https://841ba920.dexie.cloud
Database https://841ba920.dexie.cloud marked for deletion.
All connection towards it will receive warnings during a
grace period of one month.
Scheduled for final deletion on Mar 9, 2021.
To undo, see https://dexie.org/cloud/docs/cli#undelete.
Local files dexie-cloud.json and dexie-cloud.key also deleted.

$ npx dexie-cloud connect https://841ba920.dexie.cloud
Enter your email address: youremail@company.com
Enter OTP: YourOTP
Successful client confirmation.

WARNING: THIS DATABASE IS MARKED FOR DELETION ON MAR 9, 2021.

$ npx dexie-cloud undelete
Undeleting https://841ba920.dexie.cloud
Database successfully undeleted.

```

## whitelist

Allow a web app to use the database.

<pre>
npx dexie-cloud whitelist
npx dexie-cloud whitelist &lt;app origin&gt; [--delete]
</pre>

The files dexie-cloud.json and dexie-cloud.key has to be in the current or a parent directory.

- Without arguments: list all white-listed origins.
- With arguments: add origins to whitelist.
- With flag [--delete] deletes the origins instead of adding them.

#### Electron apps

Electron apps are whitelisted as "app:&lt;Application Name&gt;", where "Application Name" will be included in OTP email messages as information for the user about the app that the OTP should be used in and a warning from using it on other apps or web sites (to make user aware of phishing attacks). As Electron apps provide a "file:" based origin to its servers, there is currently no way to distinguish between different electron apps using the same DB. There is therefore no point having more than one "app:" based origin. Future versions may provide a way for multiple electron apps using the same DB though.

#### Samples

```
# Lists all whitelisted origins
npx dexie-cloud whitelist

# White-list new origins
npx dexie-cloud whitelist http://localhost:8080
npx dexie-cloud whitelist https://myapp.company.com

# White-list electron app
npx dexie-cloud whitelist "app:Marvellous ToDo List"

# Remove http://localhost:8080 from being white-listed
npx dexie-cloud whitelist http://localhost:8080 --delete
```

## import

1. Create a JSON file with the data to import (see format and samples below)
2. `npx dexie-cloud import <import-file>`

### Import file format

```ts
interface ImportFileFormat {
  schema?: {
    [tableName: string]: string; // Dexie.js schema
  };
  sealed?: boolean; // Whether schema is locked from being extended in sync
  demoUsers?: {
    [userName: `${anyname}@demo.local`]: {};
  };
  roles?: {
    [roleName: string]: {
      displayName: string;
      description: string;
      sortOrder?: number;
      permissions: DBPermissionSet;
    };
  };
  data?: {
    [realmId: string]: {
      [tableName: string]: {
        [primaryKey: string]: object;
      };
    };
  };
}
```

See [DBPermissionSet](DBPermissionSet).

### Import file example for creating or updating data

```json
{
  "data": {
    "rlm-public": {
      "products": {
        "prd1": {
          "price": 60,
          "title": "Black T-shirt, size M",
          "description": "A nice black T-shirt (medium2)"
        },
        "prd2": {
          "price": 70,
          "title": "Blue Jeans",
          "description": "Stone washed jeans"
        }
      }
    }
  }
}
```

### Import file example for deleting data

To delete individual objects, their correct realm, table and primary key need to be specified and the value shall be set to null.

```json
{
  "data": {
    "rlm-public": {
      "products": {
        "prd1": null,
        "prd2": null
      }
    }
  }
}
```

### Import file example for importing roles

```json
{
  "roles": {
    "manager": {
      "displayName": "Manager",
      "description": "Members with this role gains full permissions within the realm pointed out by the member entry",
      "sortOrder": 1,
      "permissions": { "manage": "*" }
    },
    "friend-maker": {
      "displayName": "Friend maker",
      "description": "Members with this role can create friends within a realm and update whether a friend is a good or not",
      "sortOrder": 2,
      "permissions": {
        "add": ["friends"],
        "update": {
          "friends": ["isGoodFriend"]
        }
      }
    },
    "readonly": {
      "displayName": "ReadOnly",
      "description": "Members with this role have no permissions to change any data",
      "sortOrder": 3,
      "permissions": {}
    }
  }
}
```

### Import file example for importing demo users

```json
{
  "demoUsers": {
    "foo@demo.local": {},
    "bar@demo.local": {}
  }
}
```

Demo users are users without passwords that can be used to showcase your application. Real users do not need to be imported as they authenticate to your application using OTP or your custom authentication mechanism. If you need to control your users you can do that using another framework or authentication solution. Dexie Cloud only cares about JWT claims.

### Import file example for sealing the schema

*Since dexie-cloud@>=1.1.0-beta.2*

Sealing the schema means locking the schema from letting clients add new tables as a step in a sync call.

```json
{
  "sealed": true
}
```

### Import file example for unsealing the schema

*Since dexie-cloud@>=1.1.0-beta.2*


```json
{
  "sealed": false
}
```

### Import file example for updating a sealed schema

*Since dexie-cloud@>=1.1.0-beta.2*

When a database schema is sealed, it won't tolerate the addition of new tables, so adding a table in the client code will have to be accompanied with importing the new schema into Dexie Cloud before the new clients will succeed to sync their data.

```json
{
  "schema": {
    "todoLists": "@id",
    "todoItems": "@itemId, [todoListId+realmId]",
    "newTableWithCustomPrimKey": "customId",
    "newTableWithGeneratedPrimKey": "@myGeneratedPrimKeyProp",
    "oldTableToDelete": null
  },
  "sealed": true
}
```

The syntax of the schema is equal to the syntax of a schema in Dexie.js:

```js
db.version(1).stores({
  todoLists: "@id",
  todoItems: "@itemId, [todoListId+realmId]",
  newTableWithCustomPrimKey: "customId",
  newTableWithGeneratedPrimKey: "@myGeneratedPrimKeyProp",
  oldTableToDelete: null, // delete the table
});
```

However, Dexie Cloud don't care about secondary indexes (so far) - the only information that Dexie Cloud server needs is the name of the primary key, and whether it is marked with an '@' sign or not.

Just list in Dexie, omitting a table doesn't mean deleting it. Explicitly set it to null in order to delete a table. A deleted table in the cloud does not delete its content - it is possible to bring the data back. In order to reset a table or database completely, 
use `npx dexie-cloud reset` command (not implemented yet).

## export

```
npx dexie-cloud export [options] <json-filepath>
```

The export format is the same as the import format.

### Options

| Option    | Type   | Meaning                           |
| --------- | ------ | --------------------------------- |
| schema    | flag   | Only export "schema" and "sealed" |
| data      | flag   | Only export "data"                |
| roles     | flag   | Only export "roles"               |
| demoUsers | flag   | Only export "demoUsers"           |
| realmId   | string | Only export data in given realmId |
| table     | string | Only export data in given table   |

Note: Re-importing export files is always possible to do, no matter if they are partial or not, as the import command is additive only, except for objects that are explicitly set to null.

For example, if you only want to update roles, use:

```
npx dexie-cloud export --roles roles.json
```

Then edit roles.json, and:

```
npx dexie-cloud import roles.json
```

## add-replica

<pre>
npx dexie-cloud add-replica &lt;URL to the other Dexie Cloud server&gt;
</pre>

## remove-replica

TBD

## replicas

TBD

## stats

TBD
