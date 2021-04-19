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

For simple queries (see examples below) offset() is implemented using the native IDBCursor.advance() method. To implement offset() for advanced queries, Dexie iterates over all items and ignores N of them using a JS filter. offset() is therefore much faster on simple queries than on advanced queries, but note that in both cases the time taken by offset(N) will be proportional to N. This means that offset() is not well-suited to paging in general.

#### Simple queries - IDBCursor.advance() is used

```javascript
db.[table].offset(N)
db.[table].where(index).equals(value).offset(N)
db.[table].where(index).above(value).offset(N)
db.[table].where(index).below(value).offset(N)
db.[table].where(index).between(value).offset(N)
db.[table].where(index).startsWith(value).offset(N)
```

#### Advanced queries - JS iteration is used

```javascript
db.[table].where(index).equalsIgnoreCase(value).offset(N)
db.[table].where(index).startsWithIgnoreCase(value).offset(N)
db.[table].where(index).anyOf(valueArray).offset(N)
db.[table].where(index).above(value).and(filterFunction).offset(N)
```

### A better paging approach

*UPDATED 2021-04-08!*

Paging can generally be done more efficiently by utilizing an index for sorting only.

In this example, we want to accomplish a paging approach that utilize an index for sorting rather than filtering. This solution is most efficient when the result could be very large without paging. Imagine that the "friends" table would include millions of friends with age above 21 so you really need to page the result efficiently. 

| | |
|---------|-------|
| FILTER: | friend.age > 21 |
| ORDER BY: | friend.lastName |
| PAGE SIZE: | 10 |

I will go through this conceptually. The code is not meant to be just copy/pasted. It is there to explain how first query, second query and following queries can be done. When you get the idea, you can adjust the code for your particular need.

```javascript
const PAGE_SIZE = 10;

// A helper function we will use below.
// It will prevent the same results to be returned again for next page.
function fastForward(lastRow, idProp, otherCriteria) {
  let fastForwardComplete = false;
  return item => {
    if (fastForwardComplete) return otherCriteria(item);
    if (item[idProp] === lastRow[idProp]) {
      fastForwardComplete = true;
    }
    return false;
  };
}

// Criteria filter in plain JS:
const criteraFunction = friend => friend.age > 21; // Just an example...

//
// Query First Page
//
let page = await db.friends
  .orderBy('lastName') // Utilize index for sorting
  .filter(criteraFunction)
  .limit(PAGE_SIZE)
  .toArray();

//
// Page 2
//
// "page" variable is an array of results from last request:
if (page.length < PAGE_SIZE) return; // Done
let lastEntry = page[page.length-1];
page = await db.friends
  // Use index to fast forward as much as possible
  // This line is what makes the paging optimized
  .where('lastName').aboveOrEqual(lastEntry.lastName) // makes it sorted by lastName
  
  // Use helper function to fast forward to the exact last result:
  .filter(fastForward(lastEntry, "id", criteraFunction))
  
  // Limit to page size:
  .limit(PAGE_SIZE);
  .toArray();

...

//
// Page N
//
if (page.length < PAGE_SIZE) return; // Done
lastEntry = page[page.length-1];
page = await db.friends
  .where('friendID').aboveOrEqual(lastEntry.lastName)
  .filter(fastForward(lastEntry, "id", criteraFunction))
  .limit(PAGE_SIZE);
  .toArray();


```

