---
layout: docs
title: 'DBCoreTable'
---

```ts
export interface DBCoreTable<TQuery=DBCoreQuery> {
  readonly name: string;
  readonly schema: DBCoreTableSchema;

  mutate(req: MutateRequest): Promise<MutateResponse>;
  get(req: DBCoreGetRequest): Promise<any>;
  getMany(req: DBCoreGetManyRequest): Promise<any[]>;
  query(req: DBCoreQueryRequest<TQuery>): Promise<DBCoreQueryResponse>;
  openCursor(req: DBCoreOpenCursorRequest<TQuery>): Promise<DBCoreCursor | null>;
  count(req: DBCoreCountRequest<TQuery>): Promise<number>;
}
```

See also:
* [DBCoreQuery](DBCoreQuery)
* [DBCoreTableSchema](DBCoreTableSchema)
* [MutateRequest](MutateRequest)
* [MutateResponse](MutateResponse)
* [DBCoreGetRequest](DBCoreGetRequest)
* [DBCoreGetManyRequest](DBCoreGetManyRequest)
* [DBCoreQueryRequest](DBCoreQueryRequest)
* [DBCoreQueryResponse](DBCoreQueryResponse)
* [DBCoreOpenCursorRequest](DBCoreOpenCursorRequest)
* [DBCoreCursor](DBCoreCursor)
* [DBCoreCountRequest](DBCoreCountRequest)
