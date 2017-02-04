---
layout: docs
title: 'Dexie.on()'
---

### Syntax

```javascript
db.on(eventType, subscriberFunction);
```

### Parameters

<table>
<tr><td>eventType: String</td><td>The event to subscribe to</td></tr>
<tr><td>subscriberFunction: Function</td><td>Function called when event is triggered</td></tr>
</table>

### Return Value

[Dexie](/docs/Dexie/Dexie)

### Events

["ready"](/docs/Dexie/Dexie.on.ready)

["error"](/docs/Dexie/Dexie.on.error)

["populate"](/docs/Dexie/Dexie.on.populate)

["blocked"](/docs/Dexie/Dexie.on.blocked)

["versionchange"](/docs/Dexie/Dexie.on.versionchange)

