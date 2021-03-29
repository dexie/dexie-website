---
layout: docs
title: 'Collection.modify()'
---
Modifies all objects in the table subset represented by this Collection instance.

### Syntax

```javascript
collection.modify(changes)
```

### Parameters
<table>
<tr>
  <td>changes</td>
  <td>
    Object containing changes to apply on all objects in the collection. Caller can supply a Function instead of Object.
    <ul>
      <li>If an Object is supplied, each key is the path to a property to change and each value is the new value to set</li>
      <li>
        If a Function is supplied, the given function will be called for each matched object in Collection. Function retrieves the object as first argument. Function may then modify, add or delete properties of the object. When function has returned, the framework will update the given object to database with the changes made on it.
      </li>
    </ul>
  </td>
</tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise) where resolved value is the number of modified objects. If any object fails to be updated, the entire operation will fail and Promise will reject. To catch the error, call Promise.catch() on the returned Promise, else the error will bubble to the aborted transaction and if not catched there, finally bubble to [db.on("error")](/docs/Dexie/Dexie.on.error).

### Remarks

Applies given changes to all objects in the collection.

If given changes is an Object, each key in the object represents a keyPath and each value the new value to set. A key path can be the name of a property or if containing periods (.) act as a path to a property in a nested object.

If the value is a function, the function will be called for each object so that the function may modify or delete any properties on the object. A function may also replace the object with another object by using this.value = otherObject. Finally, the function may also delete the object by doing `delete this.value;` See samples below.

### Error Handling

If any object fails to be modified or an exception occur in a callback function, entire operation will fail and transaction will be aborted.

If you catch the returned Promise, transaction will not abort, and you recieve a [Dexie.ModifyError](/docs/Dexie/Dexie.ModifyError) error object containing the following properties:

<table>
<tr><td>failures</td><td>Array of Error objects of all errors that have occurred</td></tr>
<tr><td>failedKeys</td><td>Array of the keys of the failed modifications. This array will have the same order as failures so that failures[i] will always represent the failure of failedKeys[i]</td></tr>
<tr><td>successCount</td><td>Number of successful modifications made.</td></tr>
</table>

If you do NOT catch the returned Promise, and an error occur, the transaction will be aborted.

If you want to log the error but still abort the transaction, you must encapsulate the operation in a transaction() block and catch the transaction instead. It is also possible to catch the operation and call transaction.abort() in the catch() clause.

### Sample

```javascript
db.transaction("rw", db.friends, async () => {

    // Mark bigfoots:
    await db.friends.where("shoeSize").aboveOrEqual(47).modify({isBigfoot: 1});

    // Log all bigfoots.
    // Since in transaction, and prev operation is a write-operation, the below
    // operation will be stalled until above operation completes, ensuring we
    // get the result after the modification.

    const bigfoots = await db.friends.where({isBigfoot: 1}).toArray();
    console.log("Bigfoots:", bigfoots);

}).catch (Dexie.ModifyError, error => {

    // ModifyError did occur
    console.error(error.failures.length + " items failed to modify");

}).catch (error => {
    console.error("Generic error: " + error);
});
```

### Sample using Function

```javascript
// Convert all shoeSize from european to american size:
db.friends.toCollection().modify(friend => {
    friend.shoeSize *= 0.31; // (very approximate formula...., but anyway...)
});
```

### Sample Replacing Object
The _this_ pointer points to an object containing the property _value_. This is the same value as being sent as the first argument. To replace the object entirely you cannot use the value from the argument since _"by ref"_ is not possible with javascript. Instead, use `this.value = otherObj` to change the reference, as sample code below shows:

```javascript
// Replace friend with another friend:
db.friends.where("isKindToMe").equals("no").modify(function(value) {
    this.value = new Friend({name: "Another Friend"});
});
```

With arrow function (Supported since Dexie v1.3.4):

```javascript
db.friends.where("isKindToMe").equals("no").modify((value, ref) => {
    ref.value = new Friend({name: "Another Friend"});
});
```

### Sample Deleting Object

```javascript
// Delete all friends that have been mean.
db.friends.where("hasBeenMeanToMe").equals("yes").modify(function(value) {
    delete this.value;
});
```

With arrow function (Supported since Dexie v1.3.4):

```javascript
// Delete all friends that have been mean.
db.friends.where("hasBeenMeanToMe").equals("yes").modify((value, ref) => {
    delete ref.value;
});
```

The sample above is equivalent to:

```javascript
db.friends.where("hasBeenMeanToMe").equals("yes").delete();
```

### Sample using Nested Key
 
In this sample, we modify a property that is a nested key (a key in a nested object). We include the schema and an example object in this example just to clarify how nested objects are used.

```javascript
const db = new Dexie("FriendsDB");
db.version(1).stores({ friends: "++id, name, props.shoeSize, props.bigfoot"});
db.on("populate", function () {
    db.friends.add({
        name: "Zlatan",
        props: {
            shoeSize: 47,
            bigfoot: "no" // Will be changed later ;)
        }
    });
});

db.transaction("rw", db.friends, async () => {

    // Mark bigfoots:
    await db.friends
      .where("props.shoeSize").aboveOrEqual(47)
      .modify({"props.bigfoot": "yes"});

    // Log all bigfoots.
    // Since in transaction, and prev operation is a write-operation, the
    // below operation will be stalled until above operation completes, 
    // ensuring we get the result after the modification.

    await db.friends.where("props.bigfoot").equals("yes").each(friend => {
        console.log("Found bigfoot: " + friend.name);
    });

}).catch (function (e) {
    console.error(e);
});
```
