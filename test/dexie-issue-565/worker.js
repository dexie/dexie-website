self.importScripts('https://unpkg.com/dexie@latest/dist/dexie.js');

var db = new Dexie('db');
db.version(1).stores({
  items: 'id',
});
db.items.toArray();

console.log('worker started')
