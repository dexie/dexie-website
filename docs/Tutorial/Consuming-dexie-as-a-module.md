---
layout: docs
title: 'Consuming Dexie as a module'
---

## Short Version

```javascript
import Dexie from 'dexie';

const db = new Dexie('myDb');
db.version(1).stores({
    friends: `name, age`
});

export default db;
```

Save the above code to for example `mydatabase.js` and import it from another module:

```javascript
import db from './mydatabase';
```

## Long Version

Dexie is written in Typescript/ES6 and distributed in both the [UMD](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/) and [ES](https://strongloop.com/strongblog/an-introduction-to-javascript-es6-modules/) formats. It can be consumed either as a plain script tag, required as a CJS, AMD or imported as an ES module.

Vanilla scripts are nice when testing out something. But a module-based approach is better in the long term and package manager helps you keep track of your dependencies. There are lots of combinations of package- and module systems to choose from. For web apps, `npm + webpack` works perfectly well so let's start with that alternative.

### NPM and webpack

With NPM you keep track of versions and dependencies for your app. It's also a perfect platform to use when using commonjs modules and webpack.

Assuming you've already installed nodejs that bundles `npm` with it. Start by initing your new npm package. CD to a brand new dir and do:

```bash
mkdir hello-dexie
cd hello-dexie
npm init --yes
npm install dexie --save
npm install webpack -g
```

Write your javascript file (index.js or whatever) that uses dexie:

index.js

```javascript
import Dexie from 'dexie';
var db = new Dexie('hellodb');
db.version(1).stores({
    tasks: '++id,date,description,done'
});

async function test() {
    var id = await db.tasks.put({date: Date.now(), description: 'Test Dexie', done: 0});
    console.log("Got id " + id);
    // Now lets add a bunch of tasks
    await db.tasks.bulkPut([
        {date: Date.now(), description: 'Test Dexie bulkPut()', done: 1},
        {date: Date.now(), description: 'Finish testing Dexie bulkPut()', done: 1}
    ]);
    // Ok, so let's query it
    
    var tasks = await db.tasks.where('done').above(0).toArray();
    console.log("Completed tasks: " + JSON.stringify(tasks, 0, 2));

    // Ok, so let's complete the 'Test Dexie' task.
    await db.tasks
        .where('description')
        .startsWithIgnoreCase('test dexi')
        .modify({done: 1});

    console.log ("All tasks should be completed now.");
    console.log ("Now let's delete all old tasks:");

    // And let's remove all old tasks:
    await db.tasks
        .where('date')
        .below(Date.now())
        .delete();

    console.log ("Done.");
}

test().catch (err => {
    console.error ("Uh oh! " + err.stack);
});
```

*This script uses Dexie.spawn() and yield. You need a modern browser to open it. Note that Dexie does not require using the yield keyword, but it simplifies your code a lot if you do. Read more about this on [Simplify with yield](/docs/Simplify-with-yield).*

Now, create a HTML page:

index.html
```html
<html>
    <head>
        <meta charset="utf-8">
    </head>
    <body>
        <script type="text/javascript" src="bundle.js" charset="utf-8"></script>
    </body>
</html>
```

As you can see, the page just includes a file called bundle.js. That is the file that webpack will generate when doing the following command:

```bash
webpack ./index.js bundle.js
```

Now your done to open your web page in a browser. If you're on the Edge browser, you cant just open the page from your file system because it would block indexedDB. You could use the nice module [http-server](https://www.npmjs.com/package/http-server) to start a local web server and access it from there.

```bash
npm install -g http-server
http-server .
```

Now start a browser towards [http://localhost:8080/](http://localhost:8080/) and press F12 to view the console log output.

Done.

### NPM and rollup

main.js:

```javascript
import Dexie from 'dexie';

var db = new Dexie('mydb');
db.version(1).stores({foo: 'id'});

db.foo.put({id: 1, bar: 'hello rollup'}).then(id => {
    return db.foo.get(id);
}).then (item => {
    alert ("Found: " + item.bar);
}).catch (err => {
    alert ("Error: " + (err.stack || err));
});
```

index.html
```html
<html>
    <head>
        <meta charset="utf-8">
    </head>
    <body>
        <script type="text/javascript" src="bundle.js" charset="utf-8"></script>
    </body>
</html>
```

Shell:
```bash
npm install dexie --save
npm install rollup -g
rollup main.js -o bundle.js
```

The es6 version is located on [https://npmcdn.com/dexie@latest/src/Dexie.js](https://npmcdn.com/dexie@latest/src/Dexie.js) but rollup will read the jsnext:main attribute in package.json, so it's enough to just import 'dexie'.

### requirejs

requirejs doesn't find modules with the magic that goes with npm and webpack. So you have to update your require config accordingly:

```javascript
require.config({
    paths: {
        "dexie": "node_modules/dexie/dist/dexie" // or the bower location, or simply https://npmcdn.com/dexie/dist/dexie
    }
});

// And to consume it:
requirejs(['dexie'], function (Dexie) {
    var db = new Dexie('dbname');
    ...
});
```

### systemjs

System.js is also not that magic as npm and webpack. You need to configure both its location and its module type. Here's how to do that:

```bash
npm install dexie --save
```

systemjs.config.js
```javascript
System.config({
    map: {
        'dexie': 'node_modules/dexie/dist/dexie.js'
    },
    packages: {
        'dexie': { format: 'amd' } // or 'cjs'
    }
});
```

### Typescript

With typescript and npm, it's super-easy. Just make sure to:

* Use npm to install dexie `npm install dexie --save`
* Make sure tsconfig has `{ moduleResolution: 'node' }`

In your code, import dexie and subclass it:

```typescript
// Import Dexie
import Dexie from 'dexie';

// Subclass it
class MyDatabase extends Dexie {
    contacts: Dexie.Table<IContact, number>;

    constructor (databaseName) {
        super(databaseName);
        this.version(1).stores({
            contacts: '++id,first,last'
        });
        this.contacts = this.table('contacts'); // Just informing Typescript what Dexie has already done...
    }
}

interface IContact {
    id?: number,
    first: string,
    last: string
}

// Instantiate it
var db = new MyDatabase('myDb');

// Open it
db.open().catch(err => {
    console.error(`Open failed: ${err.stack}`);
});
```

That's it! Typings are delivered with the package. **DON'T**:use tsd or typings to add dexie's type definitions. They are bundled with the lib and pointed out via package.json's `typings` property.

See also [Dexie Typescript Tutorial](/docs/Typescript)

### Next steps

#### [Architectural Overview](/docs/Tutorial/Design)

or

#### [Look at some samples](/docs/Samples)

or

#### [Migrating existing DB to Dexie](/docs/Tutorial/Migrating-existing-DB-to-Dexie)

or

#### [Back to Tutorial](/docs/Tutorial)
