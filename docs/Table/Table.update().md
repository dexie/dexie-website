---
layout: docs
title: 'Table.update()'
---

Updates existing object in the object store with given changes

### Syntax

```javascript
table.update(key, changes)
```

### Parameters
<table>
<tr><td>key</td><td>Primary key</td></tr>
<tr><td>changes</td><td>Object containing the key paths to each property you want to change.</td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise) with the number of updated records (1 if an object was updated, otherwise 0). The reason for a result of 0 can be either that the provided key was not found, or if the provided data was identical to existing data so that nothing was updated.

### Remarks

Similar to SQL UPDATE. The difference between _update()_ and _put()_ is that _update()_ will only apply given changes to the object while _put()_ will replace the entire object. Another difference is that in case key is not found, _put()_ would create a new object while _update()_ wont change anything. The returned Promise will NOT fail if key was not found but resolve with value 0 instead of 1.

Equivalent to `Table.where(":id").equals(key).modify(changes);`

### Sample

```javascript
db.friends.update(2, {name: "Number 2"}).then(function (updated) {
  if (updated)
    console.log ("Friend number 2 was renamed to Number 2");
  else
    console.log ("Nothing was updated - there were no friend with primary key: 2");
});
```

Note: Be careful with nested object values. If you have an `address` field that includes `city`, `state`, and `zipcode`, `db.friends.update(2, {address: {zipcode: 12345}})` will replace the entire `address` object with `{zipcode: 12345}`.
If your intent is to update the zipcode only, use dot notation as follows:

```ts
db.friends.update(friendId, {
  "address.zipcode": 12345
});
```

### See Also

[Collection.modify()](/docs/Collection/Collection.modify())

[Table.put()](/docs/Table/Table.put())
