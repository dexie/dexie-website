---
layout: docs
title: 'Dexie.version'
---

Static property containing the version number of the Dexie library as a decimal number that is comparable.

Dexie.version is the number representation of [Dexie.semVer](/docs/Dexie/Dexie.semVer) calculated by:

```javascript
Dexie.version = Dexie.semVer.split('.')
  .map(n => parseInt(n))
  .reduce((p,c,i) => p + (c/Math.pow(10,i*2)));
```

<table>
<tr><th>Dexie.semVer</th><th>Dexie.version</th></tr>
<tr><td style="width: 120px">"1.0.0"</td><td style="width: 120px">1.0</td></tr>
<tr><td>"1.0.1"</td><td>1.0001</td></tr>
<tr><td>"1.1.0"</td><td>1.01</td></tr>
<tr><td>"1.3.4"</td><td>1.0304</td></tr>
</table>

### Sample

```javascript
if (Dexie.version < 1.03) 
    throw new Error("Dexie v1.3.0 or higher is required");
```
