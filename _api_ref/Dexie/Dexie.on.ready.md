---
layout: docs
title: 'Dexie.on.ready'
---

### Syntax

```javascript
db.on("ready", function callback () {}, bSticky);
```

### Parameters

<table>
<tr><td>callback: Function</td><td>Callback to execute when database has successfully opened.</td></tr>
<tr><td>bSticky: Boolean</td><td>Optional. If truthy, the subscriber will survive db.close();db.open();</td></tr>
</table>

### Sample

```javascript
db.on("ready", function() { alert ("Database ready"); });
```

### Description

There are different use cases for this event. To get an easier understanding of them, skip the following text and jump directly to "Use Case 1". "Use Case 2" or "User Case 3" below.

In case database is already open, the event will trigger immediately. If not open, it will trigger as soon as database becomes successfully opened. Once subscriber is called, it will be removed from the listeners unless bSticky was set to true. If your subscriber returns a Promise, the open procedure will "block" the database until your promise becomes resolved or rejected. With "block" it means that any queued db operations will stay queued and new operations will be enqueued. If the returned promise is rejected, the call to database open () will fail, otherwise open() promise will resolve and any queued operation will resume.

#### Use Case 1: Execute code whenever database is open

This use case is similar to jQuery('document').ready() - if subscribing to the event *before* database is open, the subscriber will be queued and executed once database is ready, but if database is already open when subscribing to the event, the subscriber will be executed immediately. This use case is typically a one-shot subscription. In case database is closed and reopened, the subscriber will not be called again.

```javascript
db.on("ready", function () {
    // Will trigger once and only once.
});
```

#### Use Case 2: Block db.open() until done

An example of this use case is when you want to [Ajax Populate Sample](/docs/Dexie/Dexie.on.populate#ajax-populate-sample).

In case you want to initialize your database with contents before any operation executes, you may do so by subscribing to db.on('ready') within the same tick as you are calling db.open() and return a Promise. 

#### Use Case 3: Extend Dexie

If you are building a plugin that will extend the open procedure, you may want to use the bSticky parameter to tell Dexie to let your subscriber not be a one-shot subscriber but survice calls to db.close() / db.open(). This is a rare use case for application code, since a database is typically opened only once in the application's life time.

```javascript
db.on("ready", function () {
    // Will trigger each time db is successfully opened.
}, true);
```
