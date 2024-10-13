---
layout: docs
title: 'Dexie.SchemaError'
---

### Inheritance Hierarchy

- [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - [Dexie.DexieError](/docs/DexieErrors/DexieError)
    - Dexie.SchemaError

### Description

Happens when the database schema has errors.

### Sample using Promise.catch()

```javascript
try {
    await doSomeDatabaseWork();
} catch(error) {
    if (error?.name === Dexie.errnames.Schema) {
        // Handle schema error...
        console.error ("Schema error: " + e.message);
    } else {
        // Handle or rethrow other errors
        ...
    }
}
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.Schema === "SchemaError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
