---
layout: docs
title: 'Dexie.on()'
---

### Syntax

```javascript
db.on(eventType, subscriberFunction);
```

```js
Dexie.on(staticEventType, subscriberFunction)
```

### Parameters

<table>
<tr><td>eventType / staticEventType: String</td><td>The event to subscribe to</td></tr>
<tr><td>subscriberFunction: Function</td><td>Function called when event is triggered</td></tr>
</table>


### Static Events

["storagemutated"](/docs/Dexie/Dexie.on.storagemutated)
### Events

["ready"](/docs/Dexie/Dexie.on.ready)

["error"](/docs/Dexie/Dexie.on.error)

["populate"](/docs/Dexie/Dexie.on.populate)

["blocked"](/docs/Dexie/Dexie.on.blocked)

["versionchange"](/docs/Dexie/Dexie.on.versionchange)

["close"](/docs/Dexie/Dexie.on.close)

