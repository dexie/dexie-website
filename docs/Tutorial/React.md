---
layout: docs
title: 'Get started with Dexie in React'
---

<div style="opacity: 0.8; padding: 40px 0 40px 0">
  <img src="/assets/images/React-icon.svg" style="width:75px;">
  <span>+</span>
  <img src="/assets/images/logo-dexie-black.svg" style="width: 200px;">    
</div>

Dexie v3.2 and later comes with reactivity built-in.

In version 3.2 we've introduced **live queries** - queries that observes the result and make your component mirror the data in real time. If a change is made (by the app itself or from an external tab or worker), a binary range tree algorithms will efficiently detect whether those changes would affect your query and, if so, trigger a re-run of your query and re-render the view. [Here's a simple ToDo app example that demonstrates it](https://dexie-todo-list.stackblitz.io).

[useLiveQuery()](/docs/dexie-react-hooks/useLiveQuery()) can be explained like this: **It observes the result of a promise-returning function that queries Dexie** *(In contrast to just execute it imperatively)*. It is very composable as the only thing you have to do is to write normal async functions that queries Dexie in various ways and compute a final result. Maybe you already have some functions you wrote long time ago. Calling them from within the scope of the callback passed to [useLiveQuery()](/docs/dexie-react-hooks/useLiveQuery()) will turn your imperative async functions into an observable query.

# 1. Create a React project

Here we refer to React's own [Getting Started](https://reactjs.org/docs/getting-started.html) page.

For the impatient one, use [CodeSandbox](https://codesandbox.io) to create a React app and start code editing in your browser.

<img src="/assets/images/CodeSandBox.png" style="width: 100%" />

<br/>

# 2. Install dependencies

#### yarn
```
yarn add dexie
yarn add dexie-react-hooks
```

#### npm

```
npm install dexie
npm install dexie-react-hooks
```

#### CodeSandbox

<img
  src="/assets/images/CodeSandBoxDeps.png"
  style="width: 200px;margin: 0 10px 0 0px;opacity: 0.7;border-radius: 5px;">

# 3. Create a file `db.js` (or `db.ts`)

Applications typically have one single Dexie instance declared as its own module. This is where you declare which tables you need and how each table shall be indexed. A Dexie instance is a singleton throughout the application - you do not need to create it on demand. Export the resulting `db` instance from your module so that components or other modules can use it to query or write to the database.

```ts
// db.js
import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
  friends: '++id, name, age', // Primary key and indexed props
});

```

### Using Typescript?

If you use Typescript, table properties (such as `db.friends`) needs to be explicitely declared on a subclass of Dexie just to help out with the typings for your db instance, its tables and entity models.

```ts
// db.ts
import Dexie, { Table } from 'dexie';

export interface Friend {
  id?: number;
  name: string;
  age: number;
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  friends!: Table<Friend>; 

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      friends: '++id, name, age' // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();

```

# 4. Create a component that adds some data

Writing to the database can be done using [Table.add()](/docs/Table/Table.add()), [Table.put()](/docs/Table/Table.put()), [Table.update()](/docs/Table/Table.update()) and [Collection.modify()](/docs/Collection/Collection.modify()) - see Dexie's [quick reference](/docs/API-Reference#add-items) for examples. Here we're gonna create a simple React component that allows the user to add friends into the database using [Table.add()](/docs/Table/Table.add()).

```tsx
export function AddFriendForm({defaultAge} = {defaultAge: 21}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(defaultAge);
  const [status, setStatus] = useState("");

  async function addFriend() {
    try {

      // Add the new friend!
      const id = await db.friends.add({
        name,
        age
      });

      setStatus(`Friend ${name} successfully added. Got id ${id}`);
      setName("");
      setAge(defaultAge);
    } catch (error) {
      setStatus(`Failed to add ${name}: ${error}`);
    }
  }

  return <>
    <p>
      {status}
    </p>
    Name:
    <input
      type="text"
      value={name}
      onChange={ev => setName(ev.target.value)}
    />
    Age:
    <input
      type="number"
      value={age}
      onChange={ev => setAge(Number(ev.target.value))}
    />
    
    <button onClick={addFriend}>
      Add
    </button>
  </>
}
```

# 5. Create a component that queries data

Write a simple component that just renders all friends in the database.

```tsx
export function FriendList() {
  const friends = useLiveQuery(
    () => db.friends.toArray()
  );

  return <ul>
    {friends?.map(friend => <li key={friend.id}>
      {friend.name}, {friend.age}
    </li>)}
  </ul>;
}
```
*To make more detailed queries, refer to Dexie's [quick reference for querying items](/docs/API-Reference#query-items).*

Notice two things here:

1. The func
ion passed to [useLiveQuery()](/docs/dexie-react-hooks/useLiveQuery()) queries dexie for all friends using [toArray()](/docs/Collection/Collection.toArray()).
2. The result will be undefined on initial render - which explains why we refer it as `friends?` rather than `friends`. The reason for this is the asynchronic nature of IndexedDB. Just be aware of this fact and make sure your rendering code handles it.


# 6. Pass some query params

Let's improve the FriendList component and allow a parent component to pass some props that we use from within the query.
This time let's also use async / await (for pedagogical reasons only - it makes it simple to extend the function to do more queries if needed).

```tsx
export function FriendList({minAge, maxAge}) {
  const friends = useLiveQuery(
    async () => {
      //
      // Query Dexie's API
      //
      const friends = await db.friends
        .where('age')
        .between(minAge, maxAge)
        .toArray();

      // Return result
      return friends;
    },
    // specify vars that affect query:
    [minAge, maxAge] 
  );

  return <ul>
    {friends?.map(friend => <li key={friend.id}>
      {friend.name}, {friend.age}
    </li>)}
  </ul>;
}
```

Notice two things in the above example:

1. We pass two arguments to [useLiveQuery()](/docs/dexie-react-hooks/useLiveQuery()): the async function and the deps. The callback is just a plain async function that can compute any type of result based on what it queries. It can use Promise.all() to query things in parallel or query things sequencially after each other. Any Dexie-call along the way will be marked for observation. In any case the end result will become observed.
2. Deps are needed when the querying function uses closures that affect the query. In this case the minAge and maxAge parameters. A parent component may pass new values for it and that needs to be detected and make our query reexecued.

# 7. Put it together

```tsx
export const App = () => <>

  <h1>My simple Dexie app</h1>

  <h2>Add Friend</h2>
  <AddFriendForm defaultAge={21} />

  <h2>Friend List</h2>
  <FriendList minAge={18} maxAge={65} />

</>;

```

When running this example, notice that adding friends within the given age range will make them show up instantly in your view.

<hr/>

# Things to play with

Test out how to edit query parameters and watch the live results update, or open up app in several windows and see them instantly reflect the changes from the other window...


## Make query parameters editable

Add a new component that allows the user to specify `minAge` and `maxAge` and pass those into the props to `<FriendList>`. You will notice that updating the props will also be instantly reflected in the query results of your app (also demonstrated in [this already cooked app](https://lnv0q.csb.app/))

## Run app in multiple windows

Open your app (or for example [this one](https://dexie-todo-list.stackblitz.io)) in multiple new windows and watch them react to each other's changes.

*NOTE: IndexedDB is tied to using same browser and same origin. Sync across different origins, browsers, clients and users is another topic and requires a sync solution. If you're interested, have a look at what's coming in [Dexie Cloud](/cloud/).*

## Observe joined data

Do something similar to [this sample](/docs/API-Reference#joining) and observe the result of a function similar to `getBandsStartingWithA()` (a function that compose a result from multiple related queries). Notice that any change that affects any of the queries will make the component rerender, including the related data.

<hr/>
# More Samples and Resources

* [Play with Dexie.js and React in Codesandbox](https://codesandbox.io/s/empty-sky-lnv0q?file=/src/components/FriendList.tsx)
* [A simple ToDo list (Stackblitz)](https://stackblitz.com/edit/dexie-todo-list?file=components/TodoListView.tsx)
* [Read the docs for useLiveQuery()](/docs/dexie-react-hooks/useLiveQuery())
* [Read the general docs for Dexie.js](/docs/).
