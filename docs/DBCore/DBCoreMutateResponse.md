---
layout: docs
title: 'DBCoreMutateResponse'
---

```ts
export interface DBCoreMutateResponse {
  numFailures: number,
  failures: {[operationNumber: number]: Error};
  lastResult: any;
  results?: any[]; // Present on DBCoreAddRequest and DBCorePutRequest if request.wantResults is truthy.
}
```
Result value from [DBCoreTable](DBCoreTable).mutate().
