---
layout: docs
title: 'Dexie.UpgradeError()'
---

### Inheritance Hierarchy

- [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - [Dexie.DexieError](/docs/DexieErrors/DexieError)
    - Dexie.UpgradeError

### Description

Happens when the database could not be upgraded.

### Sample

```javascript
try {
    await doSomeDatabaseWork();
} catch(error) {
    if (error?.name === Dexie.errnames.UpgradeError) {
        // Handle UpgradeError error...
        console.error ("UpgradeError error: " + e.message);
    } else {
        // Handle or rethrow other errors
        ...
    }
}
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.Upgrade === "UpgradeError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
