---
layout: docs
title: 'DBCoreQuery'
---

```ts
export interface DBCoreQuery {
  index: DBCoreIndex;//keyPath: null | string | string[]; // null represents primary key. string a property, string[] several properties.
  range: KeyRange;
}
```
