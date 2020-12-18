---
layout: docs
title: 'useLiveQuery()'
---

# Remarks

Allows app developers load indexedDB data and keep their component updated whenever the data changes.

# Dependencies

```
npm i react
npm i dexie@>3.1-alpha
npm i dexie-react-hooks
```

# Syntax

```ts

export function useLiveQuery<T, TDefault=undefined> (
  querier: () => Promise<T> | T,
  deps?: any[], // ...like deps argument in useEffect() but defaults to empty array.
  defaultResult?: TDefault // Default value returned while data is loading
) : T | TDefault;

```

# Example

This example shows that...
- you can observe the result of an arbritary function that queries Dexie
- use state variable from useState() in your querier function.
- you can choose whether to query dexie inline or do it via a callback property.
- the component will re-render if in-parameter to the query change.
- the component will re-render if the data you are querying change

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

  // Query total friend count:
  const friendCount = useLiveQuery(() => db.friends.count());

  // If default values are returned, queries are still loading:
  if (!friends || friendCount === undefined) return null;

  return (
    <div>
      <p>
        Your have <b>{friendCount}</b> friends in total.
      </p>
      <label>
        Please enter max age:
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

As you can see in this sample, the expressions passed to useLiveQuery() can be any expression that returns a promise so if you want to decouple your component from the db, you can provide callbacks in your props and they will still be observed:

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

// Let app declare the callbacks:

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

# Playground

[Play around with liveQuery() on Stackblitz](https://stackblitz.com/edit/dexie-todo-list?file=components/TodoListView.tsx)


