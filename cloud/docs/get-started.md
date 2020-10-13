---
layout: docs-dexie-cloud
title: 'Get Started with Dexie Cloud'
---
## 1. Create your database
```
$ npx dexie-cloud create
Enter your email address: foo@bar.com
Enter OTP: sud723
Creating database...
Successfully created new database!

We created two new local files for you:
=======================================
dexie-cloud.json - URL to database
dexie-cloud.secrets - contains client ID and secret
```

## 2. White-list your app
```
$ npx dexie-cloud whitelist http://localhost:3000
```


## 3. Connect your Dexie
```ts
import Dexie from 'dexie';
import 'dexie-cloud';

const db = new Dexie('yourDb');
db.version(1).stores({
  todoItems: 'id, title, date'
});

db.cloud.connect("https://<yourdatabase>.dexie.cloud", {
  requireAuth: true
});
```
