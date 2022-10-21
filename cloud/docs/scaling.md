---
layout: docs-dexie-cloud
title: 'Sharding and Scalability'
---

Dexie Cloud is a multi-tenant sharded database based on Node.js and shards of Postgresql managed services. The sharding principle is simple as the access model is based on [realms](access-control#realms), which makes [realmId](access-control#reserved-property-names) a natural shard key for every customer.

One single Postgresql DB can handle a huge amount of users and data by itself. The real value of shardability comes with the fact that in the event of an enormous global success of your app, you never have to worry about any limit of the number of customers you can handle.

Our managed service dexie.cloud runs in Microsoft Azure as a scalable app service where each database shard consists of a managed database service [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/services/postgresql/).

The solution scales vertically using Azure's auto-scaling, and horizontally by adding new shards when needed.

For customers that buy the [On-Premise Software license](premium-software), this architecture can be managed the same way as we do.

