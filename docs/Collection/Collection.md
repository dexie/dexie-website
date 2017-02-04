---
layout: docs
title: 'Collection'
---
Represents a collection of database objects. Note that it will not contain any objects by itself. Instead, it yields a preparation for how to execute a DB query. A query will be executed when calling methods that returns a Promise, such as [toArray()](Collection.toArray()) or [each()](Collection.each()).

### Construction

Collection constructor is private. Instances are returned from the [WhereClause](WhereClause) methods and some of the [Table](Table) methods.

### Samples

```javascript
// each()
var collection = db.friends.where('name').equalsIgnoreCase('david');

collection.each(function(friend) {
    console.log('Found: ' + friend.name + ' with phone number ' + friend.phone);
});
```

```javascript
// toArray()
db.friends.where('name').startsWithIgnoreCase('d').toArray(function(friends) {
    console.log("Found " friends.length + " friends starting with d");
});
```

```javascript
// offset/limit
db.friends
  .where('age').above(25)
  .offset(10)
  .limit(10)
  .toArray(function (friends) {
    console.log(friends.map(JSON.stringify).join('\n'));
  });
```

```javascript
// count
db.friends.toCollection().count(function (count) {
    console.log(count + " friends in total");
});
```

```javascript
// or
db.friends
  .where('age').above(25)
  .or('shoeSize').above(9)
  .each (function (friend) {
    console.log("Found big friend: " + friend.name);
  });
```

### Methods

#### [and()](Collection.and())
Add JS based criteria to collection

#### [clone()](Collection.clone())
Clone the query before manipulating it further (Does not clone database items).

#### [count()](Collection.count())
Get the number of items in the collection

#### [delete()](Collection.delete())
Delete all objects in the collection

#### [desc()](Collection.desc())
Sort in descending order

#### [distinct()](Collection.distinct())
Remove duplicates of items with same primary key

#### [each()](Collection.each())
Execute query and call a function for each item

#### [eachKey()](Collection.eachKey())
Execute query on the index or primary key being used and call a function for each key

#### [eachPrimaryKey()](Collection.eachPrimaryKey())
Execute query on the index and call a function for each primary key that corresponds to the index.

#### [eachUniqueKey()](Collection.eachUniqueKey())
Execute query on the index or primary key being used and call a function for each unique key

#### [filter()](Collection.filter())
Filter objects

#### [first()](Collection.first())
Get the first item in the collection

#### [keys()](Collection.keys())
Retrieve an array containing all keys of the collection (index or primary key depending on where() clause)

#### [last()](Collection.last())
Get the last item in the collection

#### [limit()](Collection.limit())
Limit the result to given number of items

#### [modify()](Collection.modify())
Modify all objects in the collection with given properties or function.

#### [offset()](Collection.offset())
Ignore N items before given offset and return the rest

#### [or()](Collection.or())
Logical OR operation

#### [primaryKeys()](Collection.primaryKeys())
Retrieve an array containing all primary keys of the collection

#### [raw()](Collection.raw())
Don't filter results through [reading hooks](Table.hook('reading'))

#### [reverse()](Collection.reverse())
Reverse the order of items.

#### [sortBy()](Collection.sortBy())
Execute query and get an array with the results sorted by given property

#### [toArray()](Collection.toArray())
Execute query and get an array with the results sorted by the index used in the where() clause

#### [uniqueKeys()](Collection.uniqueKeys())
Retrieve an array containing all unique keys of the collection (index or primary key depending on where() clause)

#### [until()](Collection.until())
Ignores items occurring after given filter returns true.
