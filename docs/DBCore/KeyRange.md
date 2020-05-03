---
layout: docs
title: 'KeyRange'
---

```ts
export interface KeyRange {
  readonly type: RangeType;
  readonly lower: Key | undefined;
  readonly lowerOpen?: boolean;
  readonly upper: Key | undefined;
  readonly upperOpen?: boolean;
  //includes (key: Key) : boolean; Despite IDBKeyRange api - it's no good to have this as a method. Benefit from using a more functional approach.
}
```

