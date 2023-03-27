---
layout: docs-dexie-cloud
title: "Dexie Cloud REST API"
---

This doc page is under construction.

This page documents the REST API that every database in Dexie Cloud has.

## Endpoints

| [/authorize](#authorize) | Authorize endpoint |
| [/token](#token) | Token endpoint |
| [/all/...](#all-endpoint) | All data endpoint |
| [/my/...](#my-endpoint) | My data endpoint |
| [/public/...](#public-endpoint) | Public data endpoint |

### /authorize

This endpoint authenticates the user using passwordless email OTP.

| Method | GET |
| Parameters | redirect_uri, state?, nonce, name?, email? |

### /token

| Method | POST |
| Content-Type | application/json |
| Parameters | `{grant_type, client_id?, client_secret?, code?, name?, email?}`|
| Authentication | Either Basic or none (see explanation below) |

Request a token for the calling endpoint. This method can be called directly from web clients or from a server. When called from a web client, grant_type must be "authorization_code" and a valid "code" parameter retrieved from the authorize endpoint must be given. This is all handled by `dexie-cloud-addon`. But when called from one of your own servers, you can make the token endpoint produce a token for a user that your server has already authenticated:

```js
{
  grant_type: "client_credentials",
  scopes: Array<"ACCESS_DB" | "IMPERSONATE" | "MANAGE_DB" |  "GLOBAL_READ" | "GLOBAL_WRITE" | "DELETE_DB">,
  client_id: <your client ID>,
  client_secret: <your client secret>,
  public_key?: <public key> (if a refresh token is needed),
  claims: {
    sub: <userid>,
    email: <email>,
    name: <name of user to authenticate>
  }
}
```

See a [sample code to call this endpoint to authenticate end users](db.cloud.configure()#example-integrate-custom-authentication).

A client must be given the "IMPERSONATE" scope in order to call this endpoint.

#### scopes

If you use the endpoint to give out tokens for web users, the "ACCESS_DB" scope is the only one to use. If you however, need to generate a token for a server application to use the "/all/..." endpoint, you might want to request a "GLOBAL_READ" or "GLOBAL_WRITE" scope depending on whether the integration should be allowed to read or write to the database within any realm.

### /all/... endpoint

**Get all objects in given table:**

```http
GET /all/<table> HTTP/1.1
Authorization: Bearer <token from /token endpoint (with GLOBAL_READ scope)>
```

**Get all objects in given table and realm:**

```http
GET /all/<table>?realmId=<realmId> HTTP/1.1
Authorization: Bearer <token from /token endpoint (with GLOBAL_READ scope)>
```

**Get all objects in given table with a filter:**

```http
GET /all/<table>?<propName>=<propValue>&<propName2>=<propValue2>&... HTTP/1.1
Authorization: Bearer <token from /token endpoint (with GLOBAL_READ scope)>
```

This request will filter the query to only return matching objects. A concrete example:

```http
GET /all/todoItems?todoListId=xxx HTTP/1.1
Authorization: Bearer <token from /token endpoint (with GLOBAL_READ scope)>
```

*This example would give you all todoItems that has the property todoListId set to "xxx".*

**Get simple object by primary key:**

```http
GET /all/<table>/<primary key> HTTP/1.1
Authorization: Bearer <token from /token endpoint (with GLOBAL_READ scope)>
```

### /my/... endpoint

The /my/... endpoint works exactly like the /all/... endpoint, except that it doesn't search the global database but can only return objects that are accessible for the token subject.

```http
GET /my/<table> HTTP/1.1
Authorization: Bearer <token from /token endpoint (with ACCESS_DB scope)>
```

The token to use should be given out to a certain subject (userId) with the "ACCESS_DB" scope only.

**Example:**

```http
GET /my/todoLists HTTP/1.1
Authorization: Bearer <token from /token endpoint (with ACCESS_DB scope)>
```

*Lists all todoLists that the user has at least readonly access to. Either their own private lists or todo-lists that have been shared to the user.*

### /public/... endpoint

The /public/... endpoint works exactly list the /all/... and /my/... endpoints except that it will only access public data - i.e. data that resides in the public realm "rlm-public". This endpoint does not require authorization.

**Examples:**

```http
GET /public/products HTTP/1.1
```

```http
GET /public/roles HTTP/1.1
```

### POST and DELETE

In either of the REST entpoints you can use GET, POST or DELETE methods where the two latter are used to mutate data.

#### POST

POST method requires the content-type to be "application/json" and the body to be a JSON array of the data to upsert. If given data is not a JSON array, it will be treated as a single upsert. The primary key of each object is determined by the primary key property defined in your dexie schema. The schema can be synced using [npx dexie-cloud import](/cloud/docs/cli#import).

If an object already exists with the given primary key, it will be replaced, otherwise created.

**/all:**

* Each posted object must have the `realmId` property set or the request will fail.
* If the table of the schema marks the primary key be auto-generated global ID '@'-prefixed primary key, the primary key may be omitted and if so, generated by the server.

```http
POST /all/<table> HTTP/1.1
Authorization: Bearer <token from /token endpoint (with GLOBAL_WRITE scope)>
Content-Type: application/json

[{
  [primaryKeyProp]: <primaryKey>,
  realmId: <theRealmId>,
  otherProperty: otherValue,
  ...
}]
```

**/my:**

* realmId will default to the private realm of the user who's token you are using.
* primary key will default to be auto-generated on server (if the table of the schema marks the primary key to  auto-generated with global ID '@'-prefixed primary key) unless specified in the POST data.

```http
POST /my/<table> HTTP/1.1
Authorization: Bearer <token from /token endpoint (with ACCESS_DB scope and appropriate permissions if realmId is specified)>
Content-Type: application/json

[{
  ...properties
}]
```

**/public:**

* realmId can be omitted - it will be set to "rlm-public" by the server.
* primary key will default to be auto-generated on server (if the table of the schema marks the primary key to  auto-generated with global ID '@'-prefixed primary key) unless specified in the POST data.

```http
POST /all/<table> HTTP/1.1
Authorization: Bearer <token from /token endpoint (with GLOBAL_WRITE scope)>
Content-Type: application/json

[{
  ...properties
}]
```

#### DELETE

DELETE method deletes any object in given table that matches the given primary key.

```http
DELETE /all/<table>/<primaryKey> HTTP/1.1
Authorization: Bearer <token from /token endpoint (with GLOBAL_WRITE scope)>
Content-Type: application/json

```

```http
DELETE /public/<table>/<primaryKey> HTTP/1.1
Authorization: Bearer <token from /token endpoint (with GLOBAL_WRITE scope)>
Content-Type: application/json

```

*The difference between `DELETE /all/<table>/id` and `DELETE /public/<table>/id` is that the latter will only delete the object if its property `realmId` is set to `"rlm-public"` (the public realm).*

```http
DELETE /my/<table>/<primaryKey> HTTP/1.1
Authorization: Bearer <token from /token endpoint (with ACCESS_DB scope and approriate permissions on the object)>
Content-Type: application/json

```

*Deleting personal data does not require GLOBAL_WRITE scope but will fail to delete data where user does not have permissions to do so within the realm the object belongs to.*

## See Also

* [Tokens](authentication#tokens)
* [Example auth integration](db.cloud.configure()#example-integrate-custom-authentication)
