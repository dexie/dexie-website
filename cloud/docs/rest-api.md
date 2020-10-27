---
layout: docs-dexie-cloud
title: "Dexie Cloud REST API"
---

This doc page is under construction.

This page documents the REST API that every database in Dexie Cloud has.

## Endpoints

| [/authorize](#authorize) | Authorize endpoint |
| [/token](#token) | Token endpoint |

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
  client_id: <your client ID>,
  client_secret: <your client secret>,
  name: <name of user to impersonate>,
  email: <email of user to impersonate>
}
```

## See Also

- [Tokens](authentication#tokens)
- [Example auth integration](db.cloud.configure()#example-integrate-custom-authentication)
