self.importScripts('dexie.js');

debugger;
var db = new Dexie('testdb');
db.version(1).stores({
  items: 'id',
});
db.items.toArray();

console.log('worker started')
