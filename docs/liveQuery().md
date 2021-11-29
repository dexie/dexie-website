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
    .where('age')
    .between(50, 75)
    .toArray()
);

const subscription = friendsObservable.subscribe({
  next: result => console.log("Got result:", JSON.stringify(result)),
  error: error => console.error(error)
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

await sleep(1000);

console.log("1. Adding friend");
const friendId = await db.friends.add({name: "Magdalena", age: 54});
await sleep(1000);

console.log("2. Changing age to 99");
await db.friends.update(friendId, {age: 99});
await sleep(1000);

console.log("3. Changing age to 55");
await db.friends.update(friendId, {age: 55});
await sleep(1000);

console.log("4. Setting property 'foo' to 'bar'");
await db.friends.update(friendId, {foo: "bar"});
await sleep(1000);

console.log("5. Deleting friend");
await db.friends.delete(friendId);

subscription.unsubscribe();
```

*[This sample is also available in Dexie.js/samples/liveQuery/liveQuery.html](https://github.com/dfahlander/Dexie.js/blob/master/samples/liveQuery/liveQuery.html)*

The following output will be seen:

```
Got result: []
1. Adding friend
Got result: [{"name":"Magdalena","age":54,"id":1}]
2. Changing age to 99
Got result: []
3. Changing age to 55
Got result: [{"name":"Magdalena","age":55,"id":1}]
4. Setting property 'foo' to 'bar'
Got result: [{"name":"Magdalena","age":55,"id":1,"foo":"bar"}]
5. Deleting friend
Got result: []
```

<p>
  <i class="fa fa-hand-o-right" aria-hidden="true"></i> Whenever a database change is made that would affect the result of your querier, your querier callback will be re-executed and your observable will emit the new result.
</p>

If you wonder how we can possibly detect whether a change would affect your querier, the details are:

* Any call to any Dexie API done during querier execution will be tracked
* The tracking is done using an efficient datastructure for range collision detections, a [range tree](https://github.com/dfahlander/Dexie.js/blob/master/src/helpers/rangeset.ts)
* Every index being queried is tracked with the given range it queries. This makes it possible to detect whether an added object would fit within the range or not, also whether an update of an indexed property would make it become included or not.
* On add mutations, every indexed property is matched against ongoing queries
* On update mutations, if an indexed property is updated, we detect whether it would become included into any ongoing query
* On delete mutations, queries that havev the same primary keys in their results will be triggered
* Whenever the querier is triggered, the subscribed ranges are cleared, the querier re-executed and the ranges or keys being queried this time will be tracked.
* Mutated rangesets are also broadcasted across browsing contexts to wake up liveQueries in other tabs or workers

*This is a simplified explanation of how the algorithm works. The raw details can be found [here](https://github.com/dfahlander/Dexie.js/tree/master/src/live-query). There are edge cases we also take care of, and optimizations to preserve write performance of large bulk mutations. However, the optimizations does not affect the functionality else than that liveQueries may be triggered as false positives in certain times.*

## Rules for the querier function

<ul style="padding-left: 0; list-style-type: none;">
  <li style="font-style: italic;">
    <i class="fa fa-hand-o-right" aria-hidden="true"></i>
    Don't call non-Dexie asynchronous API:s directly from it.
  </li>
  <li style="font-style: italic;">
    <i class="fa fa-hand-o-right" aria-hidden="true"></i>
    If you really need to call a non-Dexie asynchronous API (such as webCrypto), wrap the returned promise through `Promise.resolve()` or <a href="Dexie/Dexie.waitFor()">Dexie.waitFor()</a> before awaiting it.
  </li>
</ul>

# Usage in Svelte and Angular

[The Svelte Store Contract](https://svelte.dev/docs#Store_contract) is a subset of the [Ecmascript Observable specification draft](https://github.com/tc39/proposal-observable) which makes the return value of liveQuery() a fully valid Svelte Store by itself. Unlike React, where we need a the [useLiveQuery() hook](dexie-react-hoos/useLiveQuery()), Svelte apps can consume the plain liveQuery() directly.

[Angular](https://angular.io/) supports Rx observables natively, and since Rx Observables also are compliant with the [Ecmascript Observable specification](https://github.com/tc39/proposal-observable), angular components also understands the return value from liveQuery() similarily.

# Usage in React and Vue
For React apps, we provide a hook, [useLiveQuery()](dexie-react-hoos/useLiveQuery()) that allows components to consume live queries.

For Vue, we still haven't implemented any specific hook, but the observable returned from liveQuery() can be consumed using [useObservable()](https://vueuse.org/rxjs/useobservable/) from @vueuse/rxjs.

## Fine grained observation

The observation is as fine-grained as it can possibly be - queries that would be affected by a modification will rerender - others not (with some exceptions - false positives happen but never false negatives). This is also true if your querier callback performs a series of awaited queries or multiple in parallell using Promise.all(). It can even contain if-statements or other conditional paths within it, determining additional queries to make before returning a final result - still, observation will function and never miss an update. No matter how simple or complex the query is - it will be monitored in detail so that if a single part of the query is affected by a change, the querier will be executed and the component will rerender.

Once again, the rule is that:
<p>
  <i class="fa fa-hand-o-right" aria-hidden="true"></i> <b>If a database change would affect the result of your querier, your querier callback will be re-executed and your observable will emit the new result.</b>
</p>

# Playgrounds

[Svelte app using liveQuery()](https://codesandbox.io/s/svelte-with-dexie-livequery-2n8bd?file=/App.svelte)

[React app using useLiveQuery()](https://stackblitz.com/edit/dexie-todo-list?file=components/TodoListView.tsx)

