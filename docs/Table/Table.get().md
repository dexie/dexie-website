---
layout: docs
title: 'Table.get()'
---

### Syntax

```javascript
// Dexie 1.x and 2.x:
table.get(primaryKey, callback);

// Dexie 2.x only:
table.get({keyPath1: value1, keyPath2: value2, ...}, callback);
```

### Parameters
<table>
  <tr>
    <td>primaryKey</td>
    <td>Primary key of object to get</td>
    <td></td>
  </tr>
  <tr>
    <td>callback: Function</td>
    <td><code>function (item) { }</code></td>
    <td><i>optional</i></td>
  </tr>
  <tr>
    <td>{keyPath1: value1, keyPath2: value2, ...}</td>
    <td>Criterias to filter</td>
    <td></td>
  </tr>
</table>

### Callback Parameters

<table>
  <tr>
    <td>item: Object</td>
    <td>Found item if any, otherwise undefined.</td>
  </tr>
</table>

### Return Value

[Promise&lt;T \| undefined&gt;](/docs/Promise/Promise)

If no item was found, the returned promise will resolve with `undefined`. Otherwise it will resolve with the found value.

### Remarks

Fetches object of given primaryKey or where given criteria `({keyPath1: value1, keyPath2: value2})` are fulfilled and returns the first matching result.

If callback is omitted and operation succeeds, returned Promise will resolve with the result of the operation, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If callback is specified and operation succeeds, given callback will be called and the returned Promise will resolve with the return value of given callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.

### Samples
```javascript
db.friends.get(1, function (firstFriend) {
    alert ("Friend with id 1: " + firstFriend.name);
});

db.friends.get(1).then (function (firstFriend) {
    alert ("Friend with id 1: " + firstFriend.name);
});

db.friends.get({firstName: "Austin", lastName: "Powers"}, austin => {
    return db.vehicles.where({owner: austin.id}).toArray(austinsVehicles => {
        austin.vehicles = austinsVehicles;
        return austin;
    });
}).then (austinWithVehicles => {
    //..
});

async function foo() {
    let firstFriend = await db.friends.get(1);
    console.log(firstFriend);
}
```

### See Also

[Table.bulkGet()](Table.bulkGet())
