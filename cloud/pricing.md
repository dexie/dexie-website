---
layout: dexie-cloud-pricing
title: "Dexie Cloud Pricing"
---

**[Dexie Cloud](/cloud/)**<a href="/cloud/" class="beta" style="font-weight: bold;">BETA</a>&nbsp; is a cloud service **supports the further development of the completely free open source project [Dexie.js](https://github.com/dexie/Dexie.js)**.

**[Dexie Cloud](/cloud/)**<a href="/cloud/" class="beta" style="font-weight: bold;">BETA</a>&nbsp; also has a [free](#evaluation) edition for labs and demos.

## Dexie Cloud Pricing

For more details, check out [this blog post](https://medium.com/dexie-js/dexie-cloud-subscription-model-cbf9a709ce7).

|                                                                                                                                             | Free      | Production &nbsp;          | On-Premise Software License             |
| ------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------- | --------------------------------------- |
| Easy to setup: **[npx dexie-cloud create](/cloud/#getting-started)**                                                                        | &#10003;  | &#10003;                   | See [these docs](docs/premium-software) |
| All features included                                                                                                                       | &#10003;  | &#10003;                   | &#10003;                                |
| Vertically scalable                                                                                                                         | -         | &#10003;                   | &#10003;                                |
| Horizontally scalable                                                                                                                       | -         | &#10003;                   | &#10003;                                |
| Max Number of databases                                                                                                                     | Unlimited | Unlimited                  | Unlimited                               |
| Evaluation users <a href="https://medium.com/dexie-js/dexie-cloud-subscription-model-cbf9a709ce7#768b" target="blog"><i>(read more)</i></a> | Max 25    | Unlimited                  | Unlimited                               |
| Production users                                                                                                                             | Max 1     | Unlimited                  | Unlimited                               |
| Demo users (can login without pwd)                                                                                                          | Max 5     | Unlimited                  | Unlimited                               |
| Use own authentication                                                                                                                      | &#10003;  | &#10003;                   | &#10003;                                |
| Full source code                                                                                                                            | -         | -                          | Available as option                     |
| Access to private git repo                                                                                                                  | -         | -                          | Available as option                     |
| Monthly fee                                                                                                                                 | 0         | USD $12 per 100 prod users | 0                                       |
| One-time license fee                                                                                                                        | 0         | 0                          | From USD $3,500 incl. 1 year support    |
| Optional continuous support                                                                                                                  | 0         | 0                          | From USD $3,500 per additional year     |

_Pricing as of August 2023. In the EU, prices are in EUR instead of USD. VAT may be added for private non-business buyers based on local tax rules._

## Evaluation

This edition is hosted and forever free but limited to 3 production users that you select. By default, any user can authenticate to your application and start an evaluation account for up to 30 active days. Evaluation accounts are free and do not occupy seats. Evaluation will be paused on days when the user doesn't use the application. After the evaluation period ends, users can continue using your application offline, but data syncing will stop. You can manually or programmatically upgrade individual evaluation accounts to production to resume sync. The Evaluation edition supports up to 3 production seats. When more seats are needed, existing databases can be upgraded to [Production](#production).

<a class='btn btn-success' href='/cloud/#getting-started' role='button'>Get started now &raquo;</a>

## Production

This edition is hosted and starts at USD $12 per month for 100 seats. It works similarly to the [Evaluation](#evaluation) edition but with more seats and auto-scaling. You control which users occupy production seats via the Dexie Cloud Management app or REST API. Integrate this REST API with the web hooks of your payment gateway (e.g., Stripe, Paypal) to manage seats based on your subscription with customers. When the number of production end users reaches 100, you can manually purchase more seats or let the subscription automatically upgrade or downgrade as needed.

<a class='btn btn-success' href='/cloud/purchase/production' role='button'>Get it now &raquo;</a>

## Dexie Cloud Server Software

Buy off the software (optionally with full source code and private GIT access) and **do whatever you want with it** except [competing with us](server-software-license-terms). Serve millions of users without any additional fee. Host it in the cloud of your own choice, or on your own bare metal. The server can be published on cloud providers such as Amazon AWS and Microsoft Azure. Email support, private git access and software updates in one year included. For continous support, the yearly support fee includes continuous updates, email support and access to our private git repo.

<a class='btn btn-primary' href='/cloud/docs/premium-software' role='button'>Read more... &raquo;</a>

<!-- <a class='btn btn-success' href='/cloud/purchase/software' role='button'>Get it now &raquo;</a> -->

---

## End User Types

This section describes the difference between Evaluation-, Production- and Demo users that are referred in the pricing table.

### Evaluation Users

Evaluation users are free time-limited user accounts that can be upgraded to production at any time. By default, Dexie Cloud allows anyone to authenticate (configurable). Unknown users do not occupy seats but receive an evaluation license for up to 30 active days. Evaluation accounts are paused on inactive days (configurable). After an evaluation period ends, the user can continue using the app but won't be able to sync data. You can indicate the user's evaluation status and prompt them to upgrade. Upgrade evaluation users to production via the Dexie Cloud Management app or REST API.

### Production Users

A production user occupies one of the production seats. The Evaluation edition includes 3 free production seats, while the Production edition comes in 100-seat packs. Manage production seat occupancy via the Dexie Cloud Management app or REST API. Integrate this API with payment gateway web hooks to manage seats based on your customer subscriptions.

### Demo Accounts

Demo accounts are for testing and demoing your app. They lack login credentials and are useful for showcasing data sharing. Demo accounts do not access private production data unless shared by a real user. Enable or disable demo accounts as needed.

Find more about Dexie Cloud and its features by visiting the [Dexie Cloud Documentation](/cloud/docs/).

<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
