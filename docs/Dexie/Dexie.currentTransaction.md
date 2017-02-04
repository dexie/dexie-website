---
layout: docs
title: 'Dexie.currentTransaction'
---

### Syntax

    var trans = Dexie.currentTransaction;

### Type

[Transaction](Transaction)

### Description

If accessed from within a [transaction scope](Dexie.transaction()), this property will contain the current [Transaction](Transaction) instance. If not within a [transaction scope](Dexie.transaction()) scope, this property will be null.

The property is a [Promise-local data](Promise.PSD) variable and requires you to be in a Dexie.Promise flow. If you're using other Promise implementations, Dexie.currentTransaction will always be null.

