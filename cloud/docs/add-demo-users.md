---
layout: docs-dexie-cloud
title: "Add demo users"
---

Use the [dexie-cloud CLI](cli) to import demo users as follows:

1. Use [npx dexie-cloud databases](cli#databases) to verify you are connected to the correct DB. If not, use [npx dexie-cloud connect](cli#connect) to connect to it. If you have no DB, use [npx dexie-cloud create](cli#create) to create one.
2. Create a JSON file 'demoUsers.json':
    ```
    {
      "demoUsers": {
        "alice@demo.local": {},
        "bob@demo.local": {}
      }
    }
    ```
3. Import the file
    ```
    npx dexie-cloud import demoUsers.json
    ```


## List current demo users

1. `npx dexie-cloud export --demoUsers demoUsers.json`
2. Open demoUsers.json

## Delete demo users

1. `npx dexie-cloud export --demoUsers demoUsers.json`
2. Edit demoUsers.json:
    ```
    {
      "demoUsers": {
        "alice@demo.local": null,
        "bob@demo.local": null
      }
    }
    ```
3. `npx dexie-cloud import demoUsers.json`

