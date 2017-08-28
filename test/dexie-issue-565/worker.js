self.importScripts('dexie.js');

debugger;
var db = new Dexie('testdb');
db.version(1).stores({
  items: 'id',
});
db.open().then(()=>{
  debugger;
  return db.items.put({id: 1, name: "foo"});
}).then(()=> {
  return db.items.filter(x => true).toArray().then(result => {
    debugger;
  });
});

//console.log('worker started')
