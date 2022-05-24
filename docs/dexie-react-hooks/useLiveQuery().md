---
layout: docs
title: 'useLiveQuery()'
---

# Remarks

Observe IndexedDB data in your React component. Make the component re-render when the observed data changes.

# See Also

[liveQuery()](https://dexie.org/docs/liveQuery())

# Dependencies

```
npm i react dexie dexie-react-hooks
```
or
```
yarn add react dexie dexie-react-hooks
```

# Syntax

```ts

export function useLiveQuery<T, TDefault=undefined> (
  querier: () => Promise<T> | T,
  deps?: any[], // ...like deps argument in useEffect() but defaults to empty array.
  defaultResult?: TDefault // Default value returned while data is loading
) : T | TDefault;

```

| Parameter | Description |
|------|------|
| querier  | Function that returns a final result (Promise) |
| deps | Variables that querier is dependent on (similar to the `deps` argument in `useEffect()`).  |
| defaultResult | Result returned on initial render - before the promise have resolved. |

## Rules for the querier function

* Don't call asynchronic API:s from it except Dexie's APIs.
* If you really need to call other async API's (such as fetch() or webCrypto), wrap the returned promise through `Promise.resolve()`. There's an example later in this page on how to do that.

# Safari Support

Safari 15.3 and older does not support [BroadcastChannel](https://caniuse.com/broadcastchannel) requied to make useLiveQuery() react to changes written from Web Workers. However, it will react to changes performed in a Service Worker. There are two small snippets that you can use to make it work with Web Workers also for older Safari browsers, see [Dexie.on.storagemutated#supporting-safari-153-and-below](/docs/Dexie/Dexie.on.storagemutated#supporting-safari-153-and-below).

# Simple Example

```tsx
import React from "react";
import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";

//
// React component
//
export function OldFriendsList() {
  const friends = useLiveQuery(
    () => db.friends
      .where('age')
      .above(75)
      .toArray()
  );
  
  if (!friends) return null; // Still loading.
  
  return <ul>
    { friends.map(friend =>
        <li key={friend.id}>
          {friend.name}, {friend.age}
        </li>)
    }
  </ul>;
}

```

## Persistent State Manager

The `useLiveQuery()` hook does not only load data - it *observes* the query for changes. This means that you can use Dexie as a persistent and RAM-sparse state manager in your React application since you don't keep entire database in RAM. If you add, update or delete a friend using Dexie methods for that (such as [Table.add](../Table/Table.add()), [Table.update()](../Table/Table.update()), [Table.delete()](../Table/Table.delete()), ...etc), any component that observes the affected data will automatically rerender.

## Fine grained observation

The observation is as fine-grained as it can possibly be - queries that would be affected by a modification will rerender - others not (with some exceptions - false positives happen but never false negatives). This is also true if your querier callback performs a series of awaited queries or multiple in parallell using Promise.all(). It can even contain if-statements or other conditional paths within it, determining additional queries to make before returning a final result - still, observation will function and never miss an update. No matter how simple or complex the query is - it will be monitored in detail so that if a single part of the query is affected by a change, the querier will be executed and the component will rerender.

# Enhanced Example

This example shows that...
- you can observe the result of an arbritary function that queries Dexie
- you can use a state from a useState() result within your querier function (just need to mention it in the deps array)
- the component will re-render if the data you are querying change
- the component will re-render if in-parameter to the query change.
- the query will change when state change.

```tsx
import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

export function FriendList() {
  const [maxAge, setMaxAge] = useState(21);

  // Query friends within a certain range decided by state:
  const friends = useLiveQuery(
    () => db.friends.where("age").belowOrEqual(maxAge).sortBy("id"),
    [maxAge] // because maxAge affects query!
  );

  // Example of another query in the same component.
  const friendCount = useLiveQuery(() => db.friends.count());

  // If default values are returned, queries are still loading:
  if (!friends || friendCount === undefined) return null;

  return (
    <div>
      <p>
        Your have <b>{friendCount}</b> friends in total.
      </p>
      <label>
        Please enter max age to query:
        <input
          type="number"
          value={maxAge}
          onChange={(ev) => setMaxAge(parseInt(ev.target.value, 10))}
        />
      </label>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            {friend.name}, {friend.age}
            <button
              onClick={() =>
                db.friends.where({ id: friend.id }).modify((f) => ++f.age)
              }
            >
              Birthday!
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```
[Open in codesandbox](https://codesandbox.io/s/empty-sky-lnv0q?file=/src/components/FriendList.tsx)

## Decoupling

The expression passed to useLiveQuery() must be a function that returns a promise. If you need to decouple your component from the db, you can provide the querying functions as callbacks instead:

```tsx
export function FriendList({getFriendCount, getFriendsByAge, onBirthdayClick}) {
  ...

  const friendCount = useLiveQuery(getFriendCount);

  const friends = useLiveQuery(
    () => getFriendsByAge(maxAge), [maxAge]
  );

  ...
      // And the button's onClick event:
      <button ... onClick={()=>onBirthdayClick(friend)}>...</button>
}

// ...and implement the callback elsewhere...

function App () {
   const getFriendCount = () => db.friends.count();

   const getFriendsByAge = maxAge =>
    db.friends
      .where('age')
      .belowOrEqual(maxAge)
      .sortBy('id');

   const onBirthdayClick = friend =>
    db.friends.where({ id: friend.id }).modify(f => ++f.age);
   
  return <FriendList
    fetchFriendCount={getFriendCount}
    fetchFriendsByAge={getFriendsByAge}
    onBirthdayClick={onBirthdayClick} />;
}

```

# Calling non-Dexie API:s from querier

If your querier callback needs to call asynchronous non-Dexie APIs to resolve its result, the promises returned by those non-Dexie API:s needs to be wrapped using `Promise.resolve()`. This is needed in order to keep the observation context alive between async calls. Even though APIs like `fetch()`, `webCrypto` etc already returns promises, this is still needed in order for useLiveQuery() to function properly. It might feel unnescessary to wrap it with `Promise.resolve()` when it's already a promise being returned, but this is a rule that needs to be followed when using `useLiveQuery()` with non-Dexie APIs. As of Dexie 3.2.0, you might not notice any warning or error if not following this rule but in a future version of Dexie, it might start throwing some explanatory error if this rule has been forgotten. 

```js
function MyComponent(id) {
  const friendWithMetaData = useLiveQuery(async () => {
    
    // Normal Dexie call:
    const friend = await db.friends.get(id);
    
    // Calling non-Dexie API - always wrap with Promise.resolve():
    try {
      const friendMetaData = await Promise.resolve (
        // Ok to call fetch if we wrap it with Promise.resolve()
        fetch(friend.metaDataUrl).then(res => res.json())
      );
      friend.metaData = friendMetaData;
    } catch (error) {
      friend.metaData = null;
    }
    return friend;
  }, [id]);
  
  return <>
    <p>Name: {friendWithMetaData.name}</p>
    <p>FooBar: {friendWithMetaData.metaData?.fooBar}</p>
  </>;
}
  
```



# Playgrounds

[Another sample using useLiveQuery() on Stackblitz](https://stackblitz.com/edit/dexie-todo-list?file=components/TodoListView.tsx)

[The sample from this page in CodeSandbox](https://codesandbox.io/s/empty-sky-lnv0q?file=/src/components/FriendList.tsx)

# See also

[liveQuery()](/docs/liveQuery())

[A blog post about this](https://medium.com/dexie-js/awesome-react-integration-coming-f212c2273d05)

[Dexie.on.storagemutated](/docs/Dexie/Dexie.on.storagemutated)
