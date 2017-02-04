---
layout: docs
title: 'Dexie.override()'
---

Enables overriding existing functions and still be able to call the original function from within your overridden function.

### Sample

The following sample shows how to log to console each time window.open() is called.

```javascript
window.open = Dexie.override(window.open, function(origFunc) {
    return function (url) {
        console.log("Opening url: " + url);
        return origFunc.apply(this, arguments);
    }
});
```
