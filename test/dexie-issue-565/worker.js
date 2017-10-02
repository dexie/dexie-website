self.importScripts('dexie.js');

var db = new Dexie('testdb');
db.version(1).stores({
  items: 'id',
});
db.open().then(()=>{
  postMessage("Could open. Now putting an item into DB");
  return db.items.put({id: 1, name: "foo"});
}).then(()=> {
  postMessage("Could put item. Now trying IDBObjectStore.getAll()");
  return db.items.toArray();
}).then(()=>{
  postMessage("Successfully called IDBObjectStore.getAll(). isWorker: " + (self.WorkerGlobalScope && self instanceof self.WorkerGlobalScope));
}).catch(err => {
  postMessage("Fail calling IDBObjectStore.getAll() from a worker. Error: " + err);
});

//console.log('worker started')
