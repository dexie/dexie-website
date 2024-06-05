---
layout: docs
title: 'Consistent remove() operator'
---

### Syntax

```ts
import { remove } from 'dexie';

// Mathematical subtraction
function withdray(acount: Account) {
  return db.accounts.update(account.id, {
    balance: remove(395)
  });
}

interface Account {
  id: string;
  balance: number;
}
```

```ts
// Remove unique items from array property
function removeTags(thing: Thing, ...tagsToRemove: string[]) {
  return db.things.update(thing.id, {
    tags: remove([...tagsToRemove])
  });
}

interface Thing {
  id: string;
  tags: string[];
}
```

### Description

Performs a sync-consistent subtraction from a property of an object in the database

- If the argument is a number or a bigint, a mathematical subtraction will be performed
- If the argument is an array, each item in the provided array will be removed from the target array property.

### Mathematical subtraction

If the argument is a number or a bigint, `remove()` will perform mathematical subtraction.

If the target property does not exist, or is null or undefined, the target value will set to `0 - argument`.

If the target value is not of same type as the argument, the target value will be converted to the type of the argument. Numbers are converted using the javascript builtin `Number()` function and bigints are converted using the javascript builtin `BigInt()` function. This means that numbers can be converted to bigints and bigints can be converted to numbers. Also numeric strings can be converted to numbers or bigints. However, if the convertion fails for any reason (such as providing a non-numerc string or another type that is not convertible to number or bigint), the value of `0` or `0n` is assumed, making the end result of the operation always leave the property with the desired type from the operation.

### Array subtraction

If the argument is an array, `remove()` will remove the given items in the argument array from the target array.

If the target property does not exist, is null, undefined or other type than an array, the result will be that an empty array is created.

### Consistency features

If using Dexie Cloud and there are two different clients with access to the same data object, and both of these performs a `remove()` operation at the same time, the result will be that both operations are applied when both clients have synced.

### See Also

[add()](<add()>)

[replacePrefix()](<replacePrefix()>)
