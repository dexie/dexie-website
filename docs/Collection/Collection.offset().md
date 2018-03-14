---
layout: docs
title: 'Collection.offset()'
---

### Syntax

```javascript
collection.offset(count)
```

### Parameters

<table>
<tr><td>count: Number</td><td>Number of entries to skip. Must be &gt;= 0.</td></tr>
</table>

### Return Value

This Collection instance (**this**)

### Remarks

Skips the first N entries from the resulting Collection. In case skipping the last N entries is requested, this method can be used in combination with the [Collection.reverse()](/dexie/Collection/Collection.reverse()) method.

### Sample

This sample will sort friends by lastName and include the last 15th to 10th friend.

```javascript
db.friends.orderBy('lastName').reverse().offset(10).limit(5);
```

### Limitations

In combination with the [or()](/dexie/Collection/Collection.or()) method, the offset() method makes no sense since the sort order of the result will be undefined ([or()](/dexie/Collection/Collection.or()) is working on multiple different indexes in parallell). Instead, use [sortBy()](/dexie/Collection/Collection.sortBy()) and then slice the resulting array from requested offset.

### Performance Notes

If executed on simple queries, the native IDBCursor.advance() method will be used (fast execution). If advanced queries are used, the implementation have to execute a query to iterate all items and ignore N items using a JS filter.

#### Examples where offset() will be fast

```javascript
db.[table].offset(N)
db.[table].where(index).equals(value).offset(N)
db.[table].where(index).above(value).offset(N)
db.[table].where(index).below(value).offset(N)
db.[table].where(index).between(value).offset(N)
db.[table].where(index).startsWith(value).offset(N)
```

#### Examples where offset() will have to iterate the collection:

```javascript
db.[table].where(index).equalsIgnoreCase(value).offset(N)
db.[table].where(index).startsWithIgnoreCase(value).offset(N)
db.[table].where(index).anyOf(valueArray).offset(N)
db.[table].where(index).above(value).and(filterFunction).offset(N)
```

### A better paging approach

Paging can generally be done more efficiently by adapting the query to the last result instead of using offset/limit.

```javascript
const PAGE_SIZE = 10;

//
// Query First Page
//
let page = await db.friends
  .orderBy('age')
  .limit(PAGE_SIZE)
  .toArray();

//
// Page 2
//
if (page.length < PAGE_SIZE) return; // Done
let lastEntry = page[page.length-1];
page = await db.friends
  .where('age').above(lastEntry.age)
  .limit(PAGE_SIZE);
  .toArray();

...

//
// Page N
//
if (page.length < PAGE_SIZE) return; // Done
lastEntry = page[page.length-1];
page = await db.friends
  .where('age').above(lastEntry.age)
  .limit(PAGE_SIZE);
  .toArray();


```

In case you have a where()-clause, the index on which it is used will also be the sort order, so:

```javascript

const PAGE_SIZE = 10;

//
// First Page
//
let page = await db.friends
  .where('age').between(25, 100) // keyrange query (affects result order)
  .filter(friend => /nice/.test(friend.notes)) // Some custom filter...
  .limit(PAGE_SIZE)
  .toArray();
  
...
//
// Page N
//
if (page.length < PAGE_SIZE) return; // Done
lastEntry = page[page.length-1];
page = await db.friends
  .where('age').between(lastEntry.age, 100)
  .filter(friend => /nice/.test(friend.notes))
  .limit(PAGE_SIZE);
  .toArray();

```

### Paged OR-queries

OR-queries, however, will not be able to be paged like this, as the resulting order is undefined. With OR-queries and paging, you would have to do a more complex query:

```javascript

const PAGE_SIZE = 10;
const ORDER_BY = "name";

// Record all matching primary keys
const primaryKeySet = new Set(await db.friends
  .where('age').above(25)
  .or('name').startsWith('X')
  .primaryKeys());
  
//
// Query first page
//
let pageKeys = [];
await db.friends
  .orderBy(ORDER_BY)
  .until(pageKeys.length === PAGE_SIZE)
  .eachPrimaryKey(id => {
    if (primaryKeySet.has(id)) {
      pageKeys.push(id);
    }
  });
let page = await Promise.all(pageKeys.map(id => db.friends.get(id)));
...

//
// Query page N
//
if (page.length < PAGE_SIZE) return; // Done
lastEntry = page[page.length-1];

pageKeys = [];
await db.friends
  .where(ORDER_BY).above(lastEntry[ORDER_BY])
  .until(pageKeys.length === PAGE_SIZE)
  .eachPrimaryKey(id => {
    if (primaryKeySet.has(id)) {
      pageKeys.push(id);
    }
  });
page = await Promise.all(pageKeys.map(id => db.friends.get(id)));
    
```
The algorithm used here is common among most database engines. Ordered pages of OR queries is a problem for SQL databases as well and they will do the same algorithm internally as we do here. Current version of Dexie just don't have a built-in query planner to do this yet, so that's why you need to write this code to do it. A future version of Dexie (probably version 4.0) will support this natively, and will do it even more efficient than the example used here (will use a Bloom filter instead of a Set, and query the primary keys more memory-efficient, using paging internally also there).

CONS:
  * Has to query all primary keys before starting to retrieve values.
  * Has to do a full index scan on the ordered index
  
PROS:
  * Will have equal performance for page 1 and page 100.
  * Does not need to load all values (which would be the case if using sortBy()) - just all primary keys.
  * Does not require the use of Array.sort() (which can be very slow on large arrays)

