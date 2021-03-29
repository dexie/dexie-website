---
layout: docs
title: 'useLiveQuery()'
---

# Remarks

Observe IndexedDB data in your React component. Make the component re-render when the observed data changes.

# Dependencies

```
npm install react
npm install dexie-react-hooks
npm install dexie@v3.1.0-alpha.8
```

# Syntax

```ts

export function useLiveQuery<T, TDefault=undefined> (
  querier: () => Promise<T> | T,
  deps?: any[], // ...like deps argument in useEffect() but defaults to empty array.
  defaultResult?: TDefault // Default value returned while data is loading
) : T | TDefault;

```
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

## Persistent state manager

The `useLiveQuery()` not just loads data - it *observes* the query for changes. This means that you can use it for persistent state management. If you add, update or delete a friend using Dexie methods for that (such as [Table.add](../Table/Table.add()), [Table.update()](../Table/Table.update()), [Table.delete()](../Table/Table.delete()), ...etc), any component that observes the affected data will automatically rerender.

## Fine grained observation

The observation is as fine-grained it can be - only components that actually queries the affected data will rerender - others will not. This is also true if your querier callback performs a series of queries or multiple in parallell. It can even have has conditional checks within it - still observation will stay exact and never miss an update. No matter how simple or complex the query is - it will be monitored in detail so that if a single part of the query is affected by a change, the querier will be executed and the component will rerender.

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

# Playgrounds

[Another sample using useLiveQuery() on Stackblitz](https://stackblitz.com/edit/dexie-todo-list?file=components/TodoListView.tsx)

[The sample from this page in CodeSandbox](https://codesandbox.io/s/empty-sky-lnv0q?file=/src/components/FriendList.tsx)

# See also

[A blog post about this](https://medium.com/dexie-js/awesome-react-integration-coming-f212c2273d05)

