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

## See Also

- [Tokens](authentication#tokens)
- [Example auth integration](db.cloud.configure()#example-integrate-custom-authentication)

