---
layout: docs-dexie-cloud
title: "Add public data"
---

Use the [dexie-cloud CLI](cli) to import data into the public realm as follows:

1. Use [npx dexie-cloud databases](cli#databases) to verify you are connected to the correct DB. If not, use [npx dexie-cloud connect](cli#connect) to connect to it. If you have no DB, use [npx dexie-cloud create](cli#create) to create one.
2. Create a JSON file (let's name it "publicData.json"):
    ```
    {
      "data": {
        "rlm-public": {
          "products": {
            "prd1": {
              "price": 60,
              "title": "Black T-shirt, size M",
              "description": "A nice black T-shirt (medium)"
            },
            "prd2": {
              "price": 70,
              "title": "Blue Jeans",
              "description": "Plain blue jeans"
            }
          }
        }
      }
    }
    ```
3. Import the file
    ```
    npx dexie-cloud import publicData.json
    ```


## List current public data

1. `npx dexie-cloud export --data --realmId rlm-public existingData.json`
2. `more existingData.json`

## How to delete, update or manage data using the CLI

See [cli#import](cli#import)
