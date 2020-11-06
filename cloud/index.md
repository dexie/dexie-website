---
layout: dexie-cloud-landing-page
title: 'Dexie Cloud'
---
## Start coding your sync-ready app today

You can start creating your awesome app based on Dexie Cloud **today** - before it's even available in beta. Declare your tables with the '@' prefix and install the addon. Declare the [access control tables](docs/access-control#access-control-tables) and client side wrappers for CRUD operations. Use the same Dexie API you are used to and create your app logic. Let the multi-user experience with sync, access control and realtime collaboration features start working as soon as Dexie Cloud is available for you.

To prepare your app for Dexie Cloud:

1. Install the alpha version of [dexie-cloud-addon](https://npmjs.com/dexie-cloud-addon) package so you can use <span style="color: #ce9178;">'@'</span>-prefixed IDs (auto-generated global IDs).
2. Declare the [access control tables](docs/access-control#access-control-tables) in your new db version and use them to support
   shared objects in teams or between users (see [sharing a ToDo list](/cloud/docs/access-control#example-sharable-todo-list) or [manage projects](/cloud/docs/access-control#example-a-simple-project-management-model)). The access is not yet checked nor synced and their content will be treated as normal app tables for now.

You will be able to code and locally test your application, taking advantage of the features in Dexie Cloud once it is released.

When launching your app, our extremely simple [pricing](/cloud/pricing) makes it risk free to grow both small and big.

<hr/>

## Want to know more?

<i class="fa fa-hand-o-right" aria-hidden="true"></i> [Access Control in Dexie Cloud](docs/access-control)

<i class="fa fa-hand-o-right" aria-hidden="true"></i> [Authentication in Dexie Cloud](docs/authentication)

### Examples

<i class="fa fa-code" aria-hidden="true"></i> [Create a sharable ToDo list](docs/access-control#example-sharable-todo-list)

<i class="fa fa-code" aria-hidden="true"></i> [Create a role-based access controlled project management model](docs/access-control#example-a-simple-project-management-model)

<i class="fa fa-code" aria-hidden="true"></i> [Integrate with PassportJS authentication](docs/db.cloud.configure()#example-integrate-custom-authentication)

<br/>
