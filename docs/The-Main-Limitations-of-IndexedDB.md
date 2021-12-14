---
layout: docs
title: 'The main limitations of IndexedDB'
---

## Ambivalent error handling 

Native IndexedDB can throw an error at you in two different ways. It may throw an exception when you call its API or it may call the *onerror* callback if you provided such. For each request you wish to control the error behavior of, you must point out the *onerror* callback to your handler for that. All this makes it very cumbersome implementing a single query operation if you are concerned about programmatical safety and transaction robustness. With Dexie, each asynchronic method returns a standard EcmaScript 6 compliant [Promise](/docs/Promise/Promise) where you do not only catch error events but also exceptions. Both uncaught errors and exceptions abort the transaction and bubble up to [Transaction](/docs/Transaction/Transaction)'s [Promise](/docs/Promise/Promise) and if uncatched there, further up to [The database global error event](/docs/Dexie/Dexie.on.error), assuring you could never miss any error or commit a transaction by accident.

## Poor queries

Native IndexedDB API has a poor set of query methods. Dexie extends the API with case insensitive queries, set matching and logical *OR*. It also simplifies the use of the existing IndexedDB capabilities such as reverse ordering, limiting search results, etc, accessible by writing short, simple, readable and intuitive javascript queries much similar to [LINQ](http://en.wikipedia.org/wiki/Language_Integrated_Query) queries (for those of you who are familiar with that).

## Not reactive

Unlike [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), indexedDB does not provide any native events when data is mutated. This makes it cumbersome for front-end components to react on database changes that happens in another tab, window or worker. Dexie comes with a magic helper function [liveQuery()](https://dexie.org/docs/liveQuery()) that turns normal (pull-based) queries into reactive ones which fits perfectly well in front-end components so that they re-render whenever data is mutated by the app itself, a worker or another tab.

## Code complexity
Without a wrapper library like Dexie, your application code could become unnecessarily complex since you need to write much more lines of code and if correct error handling is important for you, your code will soon become very complex and hard to read and maintain.

