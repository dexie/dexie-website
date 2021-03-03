---
layout: docs
title: 'Table.get()'
---

### Syntax

```ts
table.get(primaryKey): Promise
table.get({keyPath1: value1, keyPath2: value2, ...}): Promise
```

### Parameters
<table>
  <tr>
    <td>primaryKey</td>
    <td>Primary key of object to get</td>
    <td></td>
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

If operation succeeds, returned Promise will resolve with the result of the operation, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.

### Samples
```javascript
/* This code gets an object by its primary key:
*/
const firstFriend = await db.friends.get(1);
alert ("Friend with id 1: " + firstFriend.name);

/** This function queries a friend by indices firstName and lastName. It also resolves some
  relational data in the same result.
*/
function getAustinWithVehicles() {
  return db.transaction('r', [db.friends, db.vehicles], async () => {
    const austin = await db.friends.get({firstName: "Austin", lastName: "Powers"});
    // Query by "foreign key" on vehicles:
    const austinsVehicles = await db.vehicles.where({owner: austin.id}).toArray();
    // Include the vehicles in the result:
    austin.vehicles = austinsVehicles;
    return austin;
  });
}

```

### See Also

[Table.bulkGet()](Table.bulkGet())
