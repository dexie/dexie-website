const db = new Dexie ('testdbFF55bug');
db.version(1).stores({
   foo: 'id'
});

db.open().then(()=>{
  // Put an object with binary primary key:
  return db.foo.put({id: new Float32Array(1.1, 2.2, 3.3), name: "Test1"});
}).then(()=>{
  // Query all objects in the object store (Dexie will use IDBObjectStore.getAll() or IDBObjectStore.openCursor() here)
  return db.foo.toArray();  
}).then(items => {
  // Verify we get what we expect
  if (items.length !== 1) {
     throw new Error ("Expected a length of 1 item in the array");
  }
  return items[0];
}).then(item => {
  if (item.id instanceof Float32Array && item.name === "Test1")
    return;
  throw new Error ("Didn't get what was expected");
}).then(()=>{
  idb0.className = "success";
}).catch (err => {
  idb0.className = "fail";
  console.error (err);
}).then (()=> {

  //
  // HERE COMES THE TESTS THAT FAIL WITH Firefox 55
  // To be more native, let's go over to the native IndexedDB API:
  //
  const idb = db.backendDB();
  // idb is an instance of IDBDatabase

  // Test 1: IDBObjectStore.get(TypedArray)
  try {
    idb.transaction('foo', 'readonly')
     .objectStore('foo')
     .get(new Float32Array(1.1, 2.2, 3.3));
    idb1.className = "success";
  } catch (e) {
    idb1.className = "fail";
    console.error(e);
  }

  // Test 2: IDBObjectStore.get(ArrayBuffer)
  try {
    idb.transaction('foo', 'readonly')
     .objectStore('foo')
     .get(new Float32Array(1.1, 2.2, 3.3).buffer);
    idb2.className = "success";
  } catch (e) {
    idb2.className = "fail";
    console.error(e);
  }

  // Test 3: IDBObjectStore.delete(TypedArray)
  try {
    idb.transaction('foo', 'readwrite')
     .objectStore('foo')
     .delete(new Float32Array(1.1, 2.2, 3.3));
    idb3.className = "success";
  } catch (e) {
    idb3.className = "fail";
    console.error(e);
  }

  // Test 4: IDBObjectStore.delete(ArrayBuffer)
  try {
    idb.transaction('foo', 'readwrite')
     .objectStore('foo')
     .delete(new Float32Array(1.1, 2.2, 3.3).buffer);
    idb4.className = "success";
  } catch (e) {
    idb4.className = "fail";
    console.error(e);
  }
});
