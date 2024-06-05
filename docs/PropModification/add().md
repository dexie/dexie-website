---
layout: docs
title: 'Consistent add() operator'
---

### Syntax

```ts
import { add } from 'dexie';

// Mathematical addition
function birthday(friend: Friend) {
  return db.friends.update(friend.id, {
    age: add(1)
  });
}
```

```ts
// Add unique items to array property
function addTags(thing: Thing, ...tagsToAdd: string[]) {
  return db.things.update(thing.id, {
    tags: add([...tagsToAdd])
  });
}

interface Thing {
  id: string;
  tags: string[];
}
```

### Description

Performs a sync-consistent addition onto a property of an object in the database

- If the argument is a number or a bigint, a mathematical addition will be performed
- If the argument is an array, each item in the provided array will be added to the property and the target array will be sorted in ascending order.

### Mathematical addition

If the argument is a number or a bigint, `add()` will perform mathematical addition.

If the target property does not exist, or is null or undefined, the target value will set to the given argument.

If the target value is not of same type as the argument, the target value will be converted to the type of the argument. Numbers are converted using the javascript builtin `Number()` function and bigints are converted using the javascript builtin `BigInt()` function. This means that numbers can be converted to bigints and bigints can be converted to numbers. Also numeric strings can be converted to numbers or bigints. However, if the convertion fails for any reason (such as if the existing property holds a non-numerc string or another type that is not convertible to number or bigint), the value of `0` or `0n` is assumed, making the end result of the operation always leave the property with the desired type from the operation.

### Array addition

If the argument is an array, `add()` will add the given items in the argument array to the target array and then sort the target array in ascending order.

If the target property does not exist, is null, undefined or other type than an array, the target array will be created.

### Consistency features

If using Dexie Cloud and there are two different clients with access to the same data object, and both of these performs an `add()` operation at the same time, the result will be the sum of these two additions when both clients have synced.

### See Also

[remove()](<remove()>)

[replacePrefix()](<replacePrefix()>)
