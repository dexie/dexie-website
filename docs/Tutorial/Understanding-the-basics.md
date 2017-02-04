---
layout: docs
title: 'Understanding the basics'
---
# Creating Database vs opening existing

IndexedDB (and Dexie) has a built-in system for db installation and schema upgrades. This is something that many users have had problems to understand. I get the same questions over and over. People try to do these things manually.

## Best Practice

Your app should have a dedicated module where you create a Dexie instance and specify its version(s) and schema(s). This module should be required where your database is needed.

appdb.js:
```javascript
var db = new Dexie('dbname');
db.version(1).stores({
    friends: 'name, age'
});
```

## Understanding the flow

First time a browser hits the appdb.js code the following happens:

1. TBD...

Second time ...
