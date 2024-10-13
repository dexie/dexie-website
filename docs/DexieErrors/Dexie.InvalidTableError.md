---
layout: docs
title: 'Dexie.InvalidTableError'
---

### Inheritance Hierarchy

- [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - [Dexie.DexieError](/docs/DexieErrors/DexieError)
    - Dexie.InvalidTableError

### Description

Happens when trying to access a table that does not exist or is not part of current transaction.

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork()
  .then(() => {
    // Success
  })
  .catch((e) => {
    if (e?.name === 'InvalidTableError') {
      // Failed with InvalidTableError
      console.error('InvalidTable error: ' + e.message);
    }
  });
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.InvalidTable === "InvalidTableError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
