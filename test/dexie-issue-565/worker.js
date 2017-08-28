self.importScripts('https://unpkg.com/dexie@next/dist/dexie.js');

var db = new Dexie('testdb');
db.version(1).stores({
  items: 'id',
});
db.items.toArray();

console.log('worker started')
