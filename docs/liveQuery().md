---
layout: docs
title: 'liveQuery()'
---
*Since 3.1.0-beta.1*

# Remarks

Turns a Promise-returning function that queries Dexie into an Observable.

# Syntax

```ts

export function liveQuery<T>(
  querier: () => T | Promise<T>
): Observable<T>;

```

| Parameter | Description |
|------|------|
| querier  | Function that returns a final result (Promise) |

# Example

```ts
import Dexie, { liveQuery } from "dexie";

const db = new Dexie('MyDatabase');
db.version(1).stores({
  friends: '++id, name, age'
});

const friendsObservable = liveQuery (
  () => db.friends
    .where('age').above(75)
    .toArray()
);

friendsObservable.subscribe({
  next: result => console.log("Got result:", result),
  error: error => console.error(error)
});

setTimeout(() => db.friends.add({name: "Magdalena", age: 54}), 1000);
```

Directly when this code executes, you will see a log entry in the console:
```
Got result: []
```
Then when callback to setTimeout() has added a friend (after a second), you will see it log the result:
```
Got result: [{name: "Magdalena", age: 54}]
```

## Rules for the querier function

* Don't call non-Dexie asynchronous API:s directly from it.
* If you really need to call a non-Dexie asynchronous API (such as webCrypto), wrap the returned promise through `Promise.resolve()` or [Dexie.waitFor()](Dexie/Dexie.waitFor()) before awaiting it.

# Usage in Svelte and Angular

[The Svelte Store Contract](https://svelte.dev/docs#Store_contract) is a subset of the [Ecmascript Observable specification draft](https://github.com/tc39/proposal-observable) which makes the return value of liveQuery() a fully valid Svelte Store by itself. Unlike React, where we need a the [useLiveQuery() hook](dexie-react-hoos/useLiveQuery()), Svelte apps can consume the plain liveQuery() directly.

[Angular](https://angular.io/) supports Rx observables natively, and since Rx Observables also are compliant with the [Ecmascript Observable specification](https://github.com/tc39/proposal-observable), angular components also understands the return value from liveQuery() similarily.

# Usage in React and Vue
For React apps, we provide a hook, [useLiveQuery()](dexie-react-hoos/useLiveQuery()) that allows components to consume live queries.

For Vue, we still haven't implemented any specific hook, but the observable returned from liveQuery() can be consumed using [useObservable()](https://vueuse.org/rxjs/useobservable/) from @vueuse/rxjs.

## Fine grained observation

The observation is as fine-grained as it can possibly be - queries that would be affected by a modification will rerender - others not (with some exceptions - false positives happen but never false negatives). This is also true if your querier callback performs a series of awaited queries or multiple in parallell using Promise.all(). It can even contain if-statements or other conditional paths within it, determining additional queries to make before returning a final result - still, observation will function and never miss an update. No matter how simple or complex the query is - it will be monitored in detail so that if a single part of the query is affected by a change, the querier will be executed and the component will rerender.
# Playgrounds

[Svelte app using liveQuery()](https://codesandbox.io/s/svelte-with-dexie-livequery-2n8bd?file=/App.svelte)

[React app using useLiveQuery()](https://stackblitz.com/edit/dexie-todo-list?file=components/TodoListView.tsx)

