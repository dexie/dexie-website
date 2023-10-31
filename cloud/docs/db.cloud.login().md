---
layout: docs-dexie-cloud
title: "db.cloud.login()"
---

Log in a user.

Trigger an authentication flow defined by the configuration options [fetchTokens](db.cloud.configure()#fetchtokens) and [customLoginGui](db.cloud.configure()#customlogingui). If the requested email or userId is already known, provide one of them as argument.

If no arguments are provided and a user is already logged in, the returned promise will resolve immediately without any action. If an email or userId argument is passed that is different from the currently logged in user, a new login flow will start for the new user and the old user will be logged out.

## Dependencies

```
npm i dexie dexie-cloud-addon
```

## Parameters

| Parameter   | Type     | Explanation                                                             |
| ----------- | -------- | ----------------------------------------------------------------------- |
| email?      | string   | Email of requested user to login. Optional                              |
| userId?     | string   | UserID of requested user to login. Optional                             |
| grant_type? | string   | Provide 'demo' when logging in a demo user. Provide 'otp' for OTP login |


## Syntax

```ts
await db.cloud.login() // Show login dialog interaction and wait til user is finally logged in.
await db.cloud.login({email: 'someone@company.com'}) // Make sure someone@company.com is logged in, or else start an authentication flow to authenticate that user.
await db.cloud.login({grant_type: 'demo', email: 'alice@demo.local'}) // Login a demo user (the demo user must have been imported using the CLI for this to work)
```

## Return Value

`Promise<void>`


# See also

[db.cloud.logout()](db.cloud.logout())

