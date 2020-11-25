---
layout: docs
title: 'useLiveQuery()'
---

# Remarks

Allows app developers load indexedDB data and keep their component updated whenever the data changes.

# Dependencies

```
npm i dexie@>3.1-alpha
npm i dexie-react-hooks
```

# Syntax

```ts

export function useLiveQuery<T, TDefault=undefined> (
  querier: () => Promise<T> | T,
  deps?: any[], // ...like deps for useMemo(). Defaults to empty array.
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

```jsx

function MyComponent () {
  const [fromAge, setFromAge] = useState(18);

  const friendCount = useLiveQuery(
    ()=>db.friends.count()
  );
  
  const friends = useLiveQuery(
    ()=>db.friends.where('age').above(fromAge).toArray(),
    [fromAge]
  );

  // If default values are returned, queries are still loading:
  if (!friends || friendCount === undefined) return null;
  
  return <div>
    <label>
      From age: <input
        type="number"
        value={fromAge}
        onChange={ev => setFromAge(parseInt(ev.target.value))}
      />
    </label>
    <p>Your have {friendCount} friends in total.</p>
    <p>Here are the names of all friends over the age of {fromAge}:</p>
    <ul>
      {
        friends.map(friend =>
          <li key={friend.id}>
            {friend.name}, {friend.age}
            <button onClick={() => db.friends
                .where({id: friend.id})
                .modify(f => ++f.age)}>
              Birthday!
           </button>
          </li>
        )
      }
    </ul>
  </div>;
}

```
As you can see in this sample, the expressions passed to useLiveQuery() can be any expression that returns a promise. If you don't want to tie the component to the dexie logic, you can provide a fetcher in your props and it will still be observed:

```jsx
function MyComponent ({fetchFriendCount, fetchFriendsByAge, onBirthdayClick}) {
  ...

  const friendCount = useLiveQuery(fetchFriendCount);

  const friends = useLiveQuery(
    ()=>fetchFriendsByAge(fromAge), [fromAge]
  );

  ...
      // And the button's onClick event:
      <button ... onClick={()=>onBirthdayClick(friend)}>...</button>
}

// Let app declare the fetchers:

function App () {
   const fetchFriendCount = () => db.friends.count();

   const fetchFriendsByAge = fromAge =>
    db.friends
      .where('age')
      .above(fromAge)
      .toArray();

   const onBirthdayClick = friend => db.friends
    .where({id: friend.id})
    .modify(friend => ++friend.age);
   
  return <MyComponent
    fetchFriendCount={fetchFriendCount}
    fetchFriendsByAge={fetchFriendsByAge}
    onBirthdayClick={onBirthdayClick} />;
}

```

# Playground

[Stackblitz example](https://stackblitz.com/edit/dexie-todo-list?file=components/TodoListView.tsx)



