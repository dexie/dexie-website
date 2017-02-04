---
layout: docs
title: 'Dexie.on()'
---

### Syntax

    db.on(eventType, subscriberFunction);

### Parameters
<table>
<tr><td>eventType: String</td><td>The event to subscribe to</td></tr>
<tr><td>subscriberFunction: Function</td><td>Function called when event is triggered</td></tr>
</table>

### Return Value

[Dexie](Dexie)

### Events

["ready"](Dexie.on.ready)

["error"](Dexie.on.error)

["populate"](Dexie.on.populate)

["blocked"](Dexie.on.blocked)

["versionchange"](Dexie.on.versionchange)

