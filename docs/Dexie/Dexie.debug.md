---
layout: docs
title: 'Dexie.debug'
---

*Since 1.4.0*

Gets or sets whether exception's stacks will have long-stack support. This is really useful when debugging your app, but can decrease performance a little in production. It is strongly recommended to turn this on while developing / debugging your application. The reason for this is that exceptions thrown by async code, like Dexie, will have a stack property that doesnt tell you very much about what actually caused the issue. With Dexie.debug turned on, the `stack` property of any error will tell you where the issue occurred and what happened before that. If you are using chromium's debugger, you can log the stack to console.error and and get very nice links pointing directly in to the code that caused the error and also points in your code that was executed before the exception occurred.

### Hosted web apps

If this property is not set, the mode will be detected by the url that serves your app (By reading location.href). If served from localhost or 127.0.0.1, Dexie.debug will be true by default. Else, it will be false.

The auto-detection of debug mode is perfect when developing internet-hosted web applications, because you typically develop them locally but publish them on a real URL. But you can always override the default value by setting it explicitely.

### Electron apps

Electron apps are served from `file:///` - urls, no matter whether it is development or production. So Dexie.debug will default to false. Therefore, you should always set `Dexie.debug = true;` in your Electron app while developing it, but not in production if performance bothers you much. Use a build step to set Dexie.debug to true/false depending on debug / production build.

### Build-step sample for Electron apps

Somewhere in your app:
```javascript
require('dexie').debug = require('some-path/dexie-debug.json');
```

Then in your build-step, overwrite 'dexie-debug' with `false` or `true` depending on the value of process.env.NODE_ENV.

```javascript
fs.writeFile(
    'some-path/dexie-debug.json',
    process.env.NODE_ENV === 'production' ? "false" : "true",
    err => {
        if (err) throw err;
    });
```

## Dexie.debug = 'dexie'
By default, error stacks will ignore all stack frames coming from dexie.js or dexie.min.js (making your stacks more focused on your own code). In case you want to include stack frames from the dexie source code, make sure to use a non-minified version of dexie and set `Dexie.debug = 'dexie'`. This will make your stacks more verbose, but can be useful when posting a ticket to this repo.
