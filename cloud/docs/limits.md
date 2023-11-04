---
layout: docs-dexie-cloud
title: 'Limits'
---

## API Rate Limits

Dexie Cloud API has rate-limits per client IP address. A single customer can request the API from

| Request Type     | Rate-limit per eval-user | Rate-limit per prod-user |
| ---------------- | ------------------------ | ------------------------ |
| token            | 100 per hour             | 100 per hour             |
| create-db        | 10 per 12 hours          | 10 per 12 hours          |
| sync             | 50 per 5 minutes         | 200 per 5 minutes        |
| import db        | 25 per 10 minutes        | 25 per 10 minutes        |
| export db        | 25 per 10 minutes        | 25 per 10 minutes        |
| REST GET         | 200 per 15 minutes       | 200 per 1 minute         |
| REST POST/DELETE | 100 per 15 minutes       | 100 per 1 minute         |

## Client Rate-limit behavior

Dexie Cloud client ([dexie-cloud-addon](dexie-cloud-addon)) will adjust it's sync frequency according to the current rate-limit to avoid any disturbance for the end user. When 50% of sync requests has been consumed within a the time window, it will start delaying the sync calls evenly across the rest of the time window so that it avoids ever reaching the rate-limit for sync.
