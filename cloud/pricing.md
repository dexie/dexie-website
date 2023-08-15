---
layout: dexie-cloud-pricing
title: "Dexie Cloud Pricing"
---

**[Dexie Cloud](/cloud/)**<a href="/cloud/" class="beta" style="font-weight: bold;">BETA</a>&nbsp; is a cloud service **supports the further development of the completely free open source project [Dexie.js](https://github.com/dexie/Dexie.js)**.

**[Dexie Cloud](/cloud/)**<a href="/cloud/" class="beta" style="font-weight: bold;">BETA</a>&nbsp; also has a [free](#free) edition for labs and demos.

## Dexie Cloud Pricing

For more details, check out [this blog post](https://medium.com/dexie-js/dexie-cloud-subscription-model-cbf9a709ce7).

|                                                                   | Free                      | Production                | Dexie Cloud Server Software             |
| ----------------------------------------------------------------- | ------------------------- | ------------------------- | --------------------------------------- |
| Easy setup: **[npx dexie-cloud create](/cloud/#getting-started)** | &#10003;                  | &#10003;                  | See [these docs](docs/premium-software) |
| All features included                                             | &#10003;                  | &#10003;                  | &#10003;                                |
| [Customizable authentication](#customizable-authentication)       | &#10003;                  | &#10003;                  | &#10003;                                |
| [Replaceable authentication](#replaceable-authentication)         | &#10003;                  | &#10003;                  | &#10003;                                |
| Vertically scalable                                               | -                         | &#10003;                  | &#10003;                                |
| Horizontally scalable                                             | -                         | &#10003;                  | &#10003;                                |
| Max Number of databases                                           | Unlimited, free of charge | Unlimited, free of charge | Unlimited, free of charge               |
| [Evaluation users](#evaluation-users) (your end users)            | Unlimited, free of charge | Unlimited, free of charge | Unlimited, free of charge               |
| [Demo accounts](#demo-accounts) (for showcasing app)              | Unlimited, free of charge | Unlimited, free of charge | Unlimited, free of charge               |
| [Production users](#production-users) (your end users)            | 3 seats, free of charge   | USD $12/mo per 100 seats  | Unlimited, free of charge               |
| Full source code                                                  | -                         | -                         | Available as an option                  |
| Access to private Git repo                                        | -                         | -                         | Available as an option                  |
| One-time license fee                                              | -                         | -                         | From USD $4,000 incl. 1-year support    |
| Optional continuous support                                       | -                         | -                         | From USD $3,500 per additional year     |

_Pricing as of August 2023. In the EU, prices are in EUR instead of USD. VAT may be added for private non-business buyers based on local tax rules._

## Free

This edition is hosted and forever free. Let your app accept unlimited number of evaluation users and up to 3 production users. An end user's evaluation period will be paused on days when there are no sync requests from that user. After a user's evaluation period ends (30 active days), they can continue using your application offline, but data syncing will stop unless the user is upgraded to production. Upgrading a user can be done manually or programmatically. If more than 3 production seats are needed, existing databases can be upgraded to the [Production](#production) edition.

<a class='btn btn-success' href='/cloud/#getting-started' role='button'>Get started now &raquo;</a>

## Production

This edition is hosted and starts at USD $12 per month for 100 seats. It works similarly to the [Free](#free) edition but with more seats and auto-scaling. Continue enjoying free evaluation users on top of the 100 production seats. You control which users occupy production seats via the Dexie Cloud Management app or REST API. Integrate this REST API with the web hooks of your payment gateway (e.g., Stripe, Paypal) to manage seats based on your subscription with customers. When the number of production end users reaches 100, you can manually purchase more seat-packs or let the subscription automatically upgrade or downgrade as needed.

<a class='btn btn-success' href='/cloud/purchase/production' role='button'>Get it now &raquo;</a>

## Dexie Cloud Server Software

Purchase the software (optionally with full source code and private Git access) and utilize it as you wish (modify source code or taylor it for your systems - anything except [competing with us](server-software-license-terms)). Serve millions of users without additional fees. Host it on a cloud provider of your choice or your own hardware. The server is compatible with cloud platforms like Amazon AWS and Microsoft Azure. The package includes one year of chat- and email support and software updates. For continuous support, the yearly fee covers ongoing updates, chat- and email support.

<a class='btn btn-primary' href='/cloud/docs/premium-software' role='button'>Read more... &raquo;</a>

<!-- <a class='btn btn-success' href='/cloud/purchase/software' role='button'>Get it now &raquo;</a> -->

---

## End User Types

This section outlines the distinctions between Evaluation, Production, and Demo users as referenced in the pricing table. Dexie Cloud provides a security layer of [authentication](/cloud/docs/authentication) and [access control](/cloud/docs/access-control) directly between end-user and database. End users will authenticate directly with Dexie Cloud database but via a customizable authentication experience for the end user.

### Evaluation Users

Evaluation users are free time-limited end user accounts for your app, that can be upgraded to production at any time. By default, Dexie Cloud allows anyone to authenticate (configurable). Unknown users do not occupy seats but receive an evaluation license for up to 30 active days. Evaluation accounts are paused on inactive days (configurable). After an evaluation period ends, the user can continue using the app but won't be able to sync data. You can indicate the user's evaluation status and prompt them to upgrade. Upgrade evaluation users to production via the Dexie Cloud Management app or REST API.

### Production Users

A production user occupies one of the production seats. The Evaluation edition includes 3 free production seats, while the Production edition comes in 100-seat packs. Manage production seat occupancy via the Dexie Cloud Management app or REST API. Integrate this API with payment gateway web hooks to manage seats based on your customer subscriptions.

### Demo Accounts

Demo accounts are for testing and demoing your app. They lack login credentials and are useful for showcasing data sharing. Like any other user account, demo accounts do not have access to any private data that hasn't been actively shared to it. Enable or disable demo accounts as needed. Demo accounts do not occupy seats and do not expire.

Find more about Dexie Cloud and its features by visiting the [Dexie Cloud Documentation](/cloud/docs/).

## Customized Authentication

In all editions, it is possible to replace or customize end-user authentication. Dexie Cloud comes with OTP authentication and a default GUI that prompts the user for email and One-time password. There's no need to write any backend or even front-end code for this. However, customers may want to either customise the user interface, or integrate with an existing authentication solution instead of using the built-in OTP authentication from Dexie Cloud.

### Customizable Authentication

To customize the default GUI for our OTP authentication, [configure `{customLoginGui: true}`](</cloud/docs/db.cloud.configure()>) and let a component use the [`db.cloud.userInteraction` observable](/cloud/docs/dexie-cloud-addon) to display dialogs with your own look and feel. Customized authentication does not need a custom backend but can be served the way you prefer, and even from a static web site.

### Replaceable Authentication

To replace the default OTP authentication with your own authentication of choice, you'll need a backend-for-frontend (BFF) server side app to serve your client application. The server-side app needs to serve a dedicated token endpoint for dexie-cloud client that integrates with your authentication solution. See [this guide](</cloud/docs/db.cloud.configure()#example-integrate-custom-authentication>) on how it can be accomplished.

<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
