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
