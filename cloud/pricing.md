---
layout: dexie-cloud-pricing
title: "Dexie Cloud Pricing"
---

**[Dexie Cloud](/cloud/)**<a href="/cloud/" class="beta" style="font-weight: bold;">BETA</a>&nbsp; is a cloud service **that finance further development of the completely free open source project [Dexie.js](https://github.com/dexie/Dexie.js)**.

**[Dexie Cloud](/cloud/)**<a href="/cloud/" class="beta" style="font-weight: bold;">BETA</a>&nbsp; also has a [free](#evaluation) edition for labs and demos.

# Dexie Cloud Pricing

See also [this blog post](https://medium.com/dexie-js/dexie-cloud-subscription-model-cbf9a709ce7)

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

_These prices are per August 2023. In EU, prices are same numbers in EUR instead of USD. For private non-business buyers, VAT may be added to the price depending on local tax rules for private sales._

### Evaluation

This edition is hosted and forever free but limited to 3 production users that you select. By default, any user can authenticate to your application and start an evaluation account for up to 30 *active days*. Evaluation accounts are free and does not occupy seats. Evaluation will be paused on days when the user doesn't use the application. When their evaluation period ends they will not be able to continue syncing their data, but they can continue using your application offline. You can then manually or programmatically upgrade individual evaluation accounts to prodution to resume sync for them. A maximum of 3 production seats are available in the Evaluation edition. When more seats are needed, existing database can be upgraded to [Production](#production).

<a class='btn btn-success' href='/cloud/#getting-started' role='button'>Get started now &raquo;</a>

### Production

This edition is hosted and starts with USD \$12 per month for 100 seats. This edition works the same as [Evaluation](#evaluation) but with more seats and auto-scaling as needed. Like in Evaluation edition, You still control which users occupy production seats via Dexie Cloud Management app or via REST API. Integrate with this REST API in the web hooks of your payment gateway, such as Stripe, Paypal and control seats based on your own subscription with your customers. When the number of production end users reaches 100, you can purchase more seats manually, programmatically or let the subscription automatically upgrade or downgrade as the number of production users change.

<a class='btn btn-success' href='/cloud/purchase/production' role='button'>Get it now &raquo;</a>

### Dexie Cloud Server Software

Buy off the software (optionally with full source code and private GIT access) and **do whatever you want with it** except [competing with us](server-software-license-terms). Serve millions of users without any additional fee. Host it in the cloud of your own choice, or on your own bare metal. The server can be published on cloud providers such as Amazon AWS and Microsoft Azure. Email support, private git access and software updates in one year included. For continous support, the yearly support fee includes continuous updates, email support and access to our private git repo.

<a class='btn btn-primary' href='/cloud/docs/premium-software' role='button'>Read more... &raquo;</a>

<!-- <a class='btn btn-success' href='/cloud/purchase/software' role='button'>Get it now &raquo;</a> -->


## End User Types

### Evaluation Users

Dexie Cloud will by default allow anyone to authenticate (this is configurable and can be turned off). However, unknown users will not occupy any seat but get an evuation license for up to 30 active days. The evaluation is paused on inactive days (configurable). When an evaluation period ends, the user can continue using the app but won't be able to sync data. Your app can reflect the status of the user evaluation and advertise the user to upgrade. Evaluation users can be actively upgraded to production users via Dexie Cloud Management app or via REST API.

### Production Users

A production user is a user that occupies one of the production seats of the subscription. The Evaluation edition comes with 3 production seats for free and the Production edition comes in 100-seats packs. You control which users occupy production seats via Dexie Cloud Management app or via REST API. Integrate with this REST API in the web hooks of your payment gateway, such as Stripe, Paypal and control seats based on your own subscription with your customers.

### Demo Accounts

Demo accounts are end user accounts for the purpuse of testing and demoing your app. Demo accounts do not have any login credentials and are perfect for simplify demoing how your application can share data between users. We use demo accounts in our [sample todo app](https://dexie.github.io/Dexie.js/dexie-cloud-todo-app/) to simplify showcasing the sharing of todo lists between users. Demo accounts will never get access to any private production data unless a real user actively shares his or her data with it. Demo accounts can be enabled or disabled at any time.


<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
