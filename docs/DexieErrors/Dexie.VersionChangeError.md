---
layout: docs
title: 'Dexie.VersionChangeError'
---

### Inheritance Hierarchy

- [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - [Dexie.DexieError](/docs/DexieErrors/DexieError)
    - Dexie.VersionChangeError

### Description

Happens when another database instance deletes or upgrades the database so that the own instance had to be closed. The host wep app is probably not in sync with the latest version of the database. A typical solution is for the current web app to be updated from the server.

### Sample

```javascript
try {
    await doSomeDatabaseWork();
} catch(error) {
    if (error?.name === Dexie.errnames.VersionChangeError) {
        // Handle VersionChangeError error...
        console.error ("VersionChangeError error: " + e.message);
    } else {
        // Handle or rethrow other errors
        ...
    }
}
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.VersionChange === "VersionChangeError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>

### See Also

[Dexie.on.versionchange](/docs/Dexie/Dexie.on.versionchange)
