---
layout: docs
title: 'Getting Started'
weight: 10
---

Dexie.js can be consumed as a module. But let's skip that for now and just show the simplest possible setup. You will just need a text editor and a web browser.

### Quick Start

1. Copy this code to and save as 'whatever.html'
    
```html
<!doctype html>
<html>
  <head>
      <!-- Include Dexie -->
      <script src="https://unpkg.com/dexie@latest/dist/dexie.js"></script>

      <script>
          //
          // Define your database
          //
          var db = new Dexie("friend_database");
          db.version(1).stores({
              friends: 'name,shoeSize'
          });

          //
          // Put some data into it
          //
          db.friends.put({name: "Nicolas", shoeSize: 8}).then (function(){
              //
              // Then when data is stored, read from it
              //
              return db.friends.get('Nicolas');
          }).then(function (friend) {
              //
              // Display the result
              //
              alert ("Nicolas has shoe size " + friend.shoeSize);
          }).catch(function(error) {
             //
             // Finally don't forget to catch any error
             // that could have happened anywhere in the
             // code blocks above.
             //
             alert ("Ooops: " + error);
          });
      </script>
  </head>
</html>
```

2. Open the file in Chrome, Opera or Firefox. *If you need to test on IE, Edge or Safari, make sure to serve the page over http or https*

3. You should see an alert box pops up saying `Nicolas has shoe size 8`.

4. Play with this file. Change some code and see what happens.

### Next steps

#### [Consuming dexie as a module](/docs/Tutorial/Consuming-dexie-as-a-module)

or

#### [Samples](/docs/Samples)

or

#### [Migrating existing DB to Dexie](/docs/Tutorial/Migrating-existing-DB-to-Dexie)

or

#### [Back to Tutorial](/docs/Tutorial)
