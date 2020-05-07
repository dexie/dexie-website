---
layout: docs
title: 'DBCoreTable'
---

```ts
export interface DBCoreTable {
  readonly name: string;
  readonly schema: DBCoreTableSchema;

  mutate(req: DBCoreMutateRequest): Promise<DBCoreMutateResponse>;
  get(req: DBCoreGetRequest): Promise<any>;
  getMany(req: DBCoreGetManyRequest): Promise<any[]>;
  query(req: DBCoreQueryRequest): Promise<DBCoreQueryResponse>;
  openCursor(req: DBCoreOpenCursorRequest): Promise<DBCoreCursor | null>;
  count(req: DBCoreCountRequest): Promise<number>;
}
```

## See Also
* [DBCoreQuery](DBCoreQuery)
* [DBCoreTableSchema](DBCoreTableSchema)
* [DBCoreMutateRequest](DBCoreMutateRequest)
* [DBCoreMutateResponse](DBCoreMutateResponse)
* [DBCoreGetRequest](DBCoreGetRequest)
* [DBCoreGetManyRequest](DBCoreGetManyRequest)
* [DBCoreQueryRequest](DBCoreQueryRequest)
* [DBCoreQueryResponse](DBCoreQueryResponse)
* [DBCoreOpenCursorRequest](DBCoreOpenCursorRequest)
* [DBCoreCursor](DBCoreCursor)
* [DBCoreCountRequest](DBCoreCountRequest)
