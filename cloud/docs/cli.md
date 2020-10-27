---
layout: docs-dexie-cloud
title: 'Dexie Cloud CLI'
---

The Dexie Cloud command-line interface is a node binary in the same package as the Dexie Cloud addon: dexie-cloud. The CLI is a Node.js executable and works on all Node.js compliant platforms with Node.js installed.

## create
Creates a database in the cloud.

**cd** to the root directory of your web app and write:
<pre>
npx dexie-cloud create
</pre>

This command creates a new database in the cloud. You will be prompted for your email address and receive an email with the one-time password (OTP) to enter into the next prompt. Once the database has been created, your will also get two files stored in the same directory as you stand in.

| dexie-cloud.json | Contains the URL to your new database |
| dexie-cloud.key | Contains the client ID and secret for further CLI commands |

Neither of these files should be added to git as they represent environment rather than source. It is especially important to not add the .key file as it contains the secret.
The files are not needed for the web app to work - they are only useful if you want to run other CLI commands, like white-listing new apps etc. They can also be used to access the Dexie Cloud REST API from a server.

Your email will be stored in the databae as the database owner.

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

## delete
Deletes a database from the cloud.

<pre>
npx dexie-cloud delete &lt;Database-URL&gt;
</pre>

The user will have to authorize the request using email OTP. The system will prompt for email address, which needs to be an email address of a database owner. It is not nescessary to have the dexie-cloud.json or dexie-cloud.key files to do this command.

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

TODO: Fixthis!

## replicas

TODO: Fixthis!

## stats

TODO: Fixthis!
