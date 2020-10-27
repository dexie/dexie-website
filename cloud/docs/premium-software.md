---
layout: docs-dexie-cloud
title: "Run Dexie Cloud on Own Servers"
---

Dexie Cloud is available both as a cloud service and as a premium licensed softare with source included and private git repo access. The former is the obvious choice while your business is growing but at any time, you will be able to switch over to purchase the software license, giving the following benefits:

1. You can customize the software for the needs of your business. Do whatever you like with the software as long as you do not compete with Dexie Cloud. Full git access with history, branches, merge requests and updates.
2. You get cost savings if your business explodes - you no longer pay per user / month.
3. You can chose whatever cloud vendor and region to run it in or you can host it on bare metal.

## Software Architecture

Dexie Cloud consists of a Node.js app and a Postgresql database. A typical cloud setup (like our own) also includes load balancing, auto-scaling, DoS protection ([Amazon Elastic beanstalk](https://aws.amazon.com/elasticbeanstalk/) or [Azure Webapps for Node.js](docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs)). The Postgres service can typically run as a managed database service on [Amazon RDS for Postgresql](https://aws.amazon.com/rds/postgresql/) or [Azure Database for Postgresql](https://azure.microsoft.com/en-us/services/postgresql/). No matter your choice of cloud provider, the managed app and database services are very easy to get up running with, scalable and take advantage of best-practice architecture for apps and databases. You still got a cloud hosted solution but you will have more control over it and for exploding businesses, the total cost for the software becomes minimal compared to hosted version since there is no per-user cost.

## Deploy in Azure

1. Follow the guide [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/services/postgresql/) to create a Postgresql database.
2. Clone the dexie-cloud repo from the URL you got with your premium software license.
3. cd packages/dexie-cloud-server && npm install
4. Follow the guide [Azure Webapps for Node.js](docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs)
5. In azure portal, go to settings/configuration of your node app in azure and:
   - Add a new SQL Connection string DEXIE_CLOUD pointing out the postgres you set up in earlier steps.
   - Add a new application setting DXC_SECRET and set it to a long random string.
6. Make sure your app has access to your database: In azure portal, go to settings/Connection Security of your postgres database.
7. Deploy the dexie-cloud-server app to azure using [the az CLI](https://docs.microsoft.com/en-us/azure/developer/javascript/tutorial-vscode-azure-cli-node-01).
8. In the local directory of the git repo, cd to packages/dexie-cloud-server and:
   1. export DXC_SECRET=&lt;the secret you configured in azure for the same setting&gt;
   2. export DXC_URL=&lt;The URL to your node app in azure&gt;
   3. execute `npm run init-cloud`. This will setup required SQL schema and tables in the database.
      It will also create a dexie-cloud.json / dexie-cloud.key file pair.
   4. To create multiple logical databases in your installation, use `npx dexie-cloud create`, standing in a directory or
      subdirectory of the new generated files dexie-cloud.json / dexie-cloud.key.
   5. To enable email channel for OTP authentication: `npm run init-email-channel <URL of email web hook>`.
      The URL must point to a web service that sends emails given the content. TODO: Refer to Web hook docs!

## Deploy in Amazon AWS

TBD!

## Enable Horizontal Scaling

The default setup of the Dexie Cloud service use a single shard. To add shards, create new postgres databases and note down the
connection string of each of the new databases. To manage and configure shards in your Dexie Cloud cluster, use the npm scripts in the dexie-cloud-server repo `add-shard`, `update-shard`, `move-realms` and `remove-shard`.

## Zero Downtime Migration of Data

When you've successfully deployed the Dexie Cloud software, the next step is to import the database from the hosted Dexie Cloud into your new installation.

1. Make sure to stand in a directory or sub directory of your package.json, dexie-cloud.json and dexie-cloud.key files of your new installation on your local machine and that you have the DXC_SECRET and DXC_URL env variables set correctly.
2. ```
   npx dexie-cloud start-replication --from <URL of the hosted database> --to <URL of the new database on your own installation>
   ```
   After OTP authorization, this will start a replication from the hosted database to your database instance. This may take some time depending on the amount of data you are migrating. To view progress, run `npx dexie-cloud replication-progress`. When it shows "in sync", it's time for the next step.
3. Point your web app to your new database URL `db.cloud.configure({databaseUrl: newURL, ...})` and publish the web app.
4. Now it's time to start redirecting all your users that haven't yet updated their web app to the new database:
   ```
   npx dexie-cloud redirect --from <URL of hosted db> --to <URL of your dexie-cloud-server app>
   ```
   After OTP authorization, the hosted service will start redirecting ongoing and incoming connections to the new database URL.
5. Run `npx dexie-cloud stats --db <URL of hosted database>` regularly to verify that the connections to the hosted database is dropping down to zero.
6. When connections drop to zero, run `npx delete-db <URL of the hosted database>`. Confirm it in the confirmation email. The hosted service will keep redirecting users to your new database for 6 months after database has been deleted.
