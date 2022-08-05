---
layout: docs
title: "useObservable()"
---

# Remarks

Let your react component subscribe to an observable and re-render whenever the observable emits new value. Two overloads of the hook allows for either supplying an observable, or supplying a callback that returns an observable. The latter can be accompanied by a `deps` property making the callback be re-executed when any of the provided dependencies change.

# See Also

[Ecmascript Observable proposal](https://github.com/tc39/proposal-observable)

[RxJS](https://github.com/ReactiveX/RxJS)

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
export function useObservable<T, TInitialValue = undefined>(
  observable: Observable<T>,
  initialValue?: TInitialValue // if observable represents async result
): T | TInitialValue;

export function useObservable<T, TInitialValue = undefined>(
  observableFactory: () => Observable<T>,
  deps?: any[], // if observableFactory depends on some vars
  initialValue?: TInitialValue // if observable represents async result
): T | TInitialValue;
```

| Parameter         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| observable        | An object with a `subscribe` method taking a callback as 1st arg and optionally and error callback as 2nd arg, returning either an unsubscribe function or an object with an unsubscribe method. This pattern is compatible with several different observable libraries including ES Observable, RxJS, Svelte Store contract etc. If the object also has method `getValue()` (as is the case with RxJS BehaviourSubject), that method will be used to get the initial value. |
| observableFactory | Function that returns an observable. This function will be re-executed if deps change. If the new observable does not have a current value, the last current value will persist until new observable emits a value.                                                                                                                                                                                                                                                          |
| deps              | Variables that observableFactory is dependent on (similar to the `deps` argument in `useEffect()`).                                                                                                                                                                                                                                                                                                                                                                          |
| initialResult     | Result returned on initial render if observable is async and does not have a current value.                                                                                                                                                                                                                                                                                                                                                                                  |

```ts
interface Observable<T> {
  subscribe(
    onNext: (x: T) => any,
    onError?: (error: any) => any
  ): (() => any) | { unsubscribe(): any };
  getValue?(): T;
}
```

# Simple Example

```tsx
import React from "react";
import { BehaviorSubject } from "rxjs";
import { useObservable } from "dexie-react-hooks";

const counter = new BehaviorSubject(1);

//
// React component
//
export function SimpleCounter() {
  const currentCount = useObservable(counter);

  return (
    <>
      <p>Current Count is {currentCount}</p>
      <button onClick={() => counter.next(counter.getValue() + 1)}>
        Click to increment
      </button>
    </>
  );
}
```

## How does this hook relate to Dexie.js?

`useObservable()` is vital for consuming the API of [dexie-cloud-addon](/cloud/docs/dexie-cloud-addon) that have properties that are observables. 

There are other generic libraries with similar hooks that could be used equally well (such as [react-use](https://github.com/streamich/react-use)) but our version also allows to pass an observable-returning function, accompanied with a `deps` array.

`useObsevable()` is also an internal building block for [useLiveQuery()](/docs/dexie-react-hooks/useLiveQuery()), which is implemented as so:

```ts
const useLiveQuery = (callback, deps, defaultResult) =>
  useObservable(() => liveQuery(callback), deps, defaultResult);
```
