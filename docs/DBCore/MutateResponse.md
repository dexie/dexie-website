---
layout: docs
title: 'MutateResponse'
---

```ts
export interface MutateResponse {
  numFailures: number,
  failures: {[operationNumber: number]: Error};
  lastResult: Key;
  results?: Key[]; // Present on AddRequest and PutRequest if request.wantResults is truthy.
}
```
Result value from [DBCoreTable](DBCoreTable).mutate().
