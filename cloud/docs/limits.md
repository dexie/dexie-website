---
layout: docs-dexie-cloud
title: 'Dexie Cloud API Limits'
---

## API Rate Limits

Dexie Cloud API has rate-limits per end-user for authorized requests and per client IP address for unauthorized requests.

| Request Type     | Eval users                            | Prod users                          |
| ---------------- | ------------------------------------- | ----------------------------------- |
| token            | 100 per hour per target end-user      | 100 per hour per target end-user    |
| create-db        | 10 per 12 hours per creator email     | 10 per 12 hours per creator email   |
| sync             | 50 per 5 minutes per end user         | 200 per 5 minutes per end user. (Client gracefully slows down sync if reaching 50%, avoiding ever reaching this limit)      |
| import db        | 25 per 10 minutes per API client      | 25 per 10 minutes per API client    |
| export db        | 25 per 10 minutes per API client      | 25 per 10 minutes per API client    |
| REST GET         | 200 per 15 minutes per client or user | 200 per 1 minute per client or user |
| REST POST/DELETE | 100 per 15 minutes per client or user | 100 per 1 minute per client or user |

## Client Rate-limit behavior

Dexie Cloud client ([dexie-cloud-addon](dexie-cloud-addon)) will adjust it's sync frequency according to the current rate-limit to avoid any disturbance for the end user. When 50% of sync requests has been consumed within a the time window, it will start delaying the sync calls evenly across the rest of the time window so that it avoids ever reaching the rate-limit for sync.
