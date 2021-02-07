---
layout: docs-dexie-cloud
title: 'Dexie Cloud CLI'
---

The Dexie Cloud command-line interface `dexie-cloud` is an executable npm package. It is the CLI for creating and managing sync databases. You do not have to install the package to use it. The only prerequisit is having node.js installed on your system. The `npx` tool that comes with Node.js will download it temporarily from npm when you run any dexie-cloud command, such as `npx dexie-cloud --help`.

## create
Creates a database in the cloud.

**cd** to the root directory of your web app and write:
<pre>
npx dexie-cloud create [--server &lt;URL&gt;]
</pre>

This command creates a new database in the cloud. You will be prompted for your email address and receive an email with the one-time password (OTP) to enter into the next prompt. Once the database has been created, your will also get two files stored in the same directory as you stand in.

| dexie-cloud.json | Contains the URL to your new database |
| dexie-cloud.key | Contains the client ID and secret for further CLI commands |

Neither of these files should be added to git as they represent environment rather than source. It is especially important to not add the .key file as it contains the secret.
The files are not needed for the web app to work - they are only useful if you want to run other CLI commands, like white-listing new apps etc. They can also be used to access the Dexie Cloud REST API from a server.

Your email will be stored in the databae as the database owner.

#### Options
```
--server <URL>  Create the database on an alternate server (default is https://dexie.cloud)
```

#### Sample
```
$ npx dexie-cloud create
Enter your email address: youremail@company.com
Enter OTP: YourOTP
Creating database...
Successfully created new database!

We created two new local files for you:
=======================================
dexie-cloud.json - URL to database
dexie-cloud.key - contains client ID and secret
```

#### Files to be listed in .gitignore
```
dexie-cloud.json
dexie-cloud.key
```

## authorize
Authorizes another user to manage the database.

<pre>
npx dexie-cloud authorize
npx dexie-cloud authorize &lt;email address&gt; [--delete]
</pre>

* Without arguments: list email addresses of authorized database managers.
* With arguments: authorize or un-authorized given email address.
* With flag [--delete] deletes the authorized email address. You can unauthorize yourself only if you've authorized someone else first.

Authorizing a user will create an API client for that user with its own client ID and secret.

## connect
Request client_id and client_secret for an existing db and save them into dexie-cloud.key. Also set active database in dexie-cloud.json. This command will require email OTP verification before retrieving credentials and the OTP receiver must have been authorized to manager the database using the [npx dexie-cloud authorize](#autorize) command, or be the creator of the database.

<pre>
npx dexie-cloud connect &lt;Database URL&gt;
</pre>

#### Sample
```
$ npx dexie-cloud connect https://zrp8lv7rq.dexie.cloud
Enter your email address: youremail@company.com
Enter OTP: YourOTP
Client created: js9bfkyfqst9hcb9

We created two new local files for you:
=======================================
dexie-cloud.json - URL to database
dexie-cloud.key - contains client ID and secret
```

#### Files to be listed in .gitignore
```
dexie-cloud.json
dexie-cloud.key
```

## delete
Deletes a database from the cloud.

<pre>
npx dexie-cloud delete &lt;Database-URL&gt;
</pre>

## whitelist

Allow a web app to use the database.

<pre>
npx dexie-cloud whitelist
npx dexie-cloud whitelist &lt;app origin&gt; [--delete]
</pre>

The files dexie-cloud.json and dexie-cloud.key has to be in the current or a parent directory.

* Without arguments: list all white-listed origins.
* With arguments: add origins so white list.
* With flag [--delete] deletes the origins instead of adding them.

#### Samples
```
# Lists all whitelisted origins
npx dexie-cloud whitelist

# White-list new origins
npx dexie-cloud whitelist http://localhost:8080
npx dexie-cloud whitelist https://myapp.company.com

# Remove http://localhost:8080 from being white-listed
npx dexie-cloud whitelist http://localhost:8080 --delete
```

## add-replica

<pre>
npx dexie-cloud add-replica &lt;URL to the other Dexie Cloud server&gt;
</pre>


## remove-replica

TBD

## replicas

TBD

## stats

TBD
