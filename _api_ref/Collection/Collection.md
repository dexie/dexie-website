---
layout: docs
title: 'Collection'
---

Represents a collection of database objects. Note that it will not contain any objects by itself. Instead, it yields a preparation for how to execute a DB query. A query will be executed when calling methods that returns a Promise, such as [toArray()](/docs/Collection/Collection.toArray()), [keys()](/docs/Collection/Collection.keys()), [count()](/docs/Collection/Collection.count()) or [each()](/docs/Collection/Collection.each()).

### Construction

Collection constructor is private. Instances are returned from the [WhereClause](/docs/WhereClause/WhereClause) methods and some of the [Table](/docs/Table/Table) methods.

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
    console.log("Found: " + friends.length + " friends starting with d");
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

#### [and()](/docs/Collection/Collection.and())
Add JS based criteria to collection

#### [clone()](/docs/Collection/Collection.clone())
Clone the query before manipulating it further (Does not clone database items).

#### [count()](/docs/Collection/Collection.count())
Get the number of items in the collection

#### [delete()](/docs/Collection/Collection.delete())
Delete all objects in the collection

#### [desc()](/docs/Collection/Collection.desc())
Sort in descending order

#### [distinct()](/docs/Collection/Collection.distinct())
Remove duplicates of items with same primary key

#### [each()](/docs/Collection/Collection.each())
Execute query and call a function for each item

#### [eachKey()](/docs/Collection/Collection.eachKey())
Execute query on the index or primary key being used and call a function for each key

#### [eachPrimaryKey()](/docs/Collection/Collection.eachPrimaryKey())
Execute query on the index and call a function for each primary key that corresponds to the index.

#### [eachUniqueKey()](/docs/Collection/Collection.eachUniqueKey())
Execute query on the index or primary key being used and call a function for each unique key

#### [filter()](/docs/Collection/Collection.filter())
Filter objects

#### [first()](/docs/Collection/Collection.first())
Get the first item in the collection

#### [keys()](/docs/Collection/Collection.keys())
Retrieve an array containing all keys of the collection (index or primary key depending on where() clause)

#### [last()](/docs/Collection/Collection.last())
Get the last item in the collection

#### [limit()](/docs/Collection/Collection.limit())
Limit the result to given number of items

#### [modify()](/docs/Collection/Collection.modify())
Modify all objects in the collection with given properties or function.

#### [offset()](/docs/Collection/Collection.offset())
Ignore N items before given offset and return the rest

#### [or()](/docs/Collection/Collection.or())
Logical OR operation

#### [primaryKeys()](/docs/Collection/Collection.primaryKeys())
Retrieve an array containing all primary keys of the collection

#### [raw()](/docs/Collection/Collection.raw())
Don't filter results through [reading hooks](/docs/Table/Table.hook('reading'))

#### [reverse()](/docs/Collection/Collection.reverse())
Reverse the order of items.

#### [sortBy()](/docs/Collection/Collection.sortBy())
Execute query and get an array with the results sorted by given property

#### [toArray()](/docs/Collection/Collection.toArray())
Execute query and get an array with the results sorted by the index used in the where() clause

#### [uniqueKeys()](/docs/Collection/Collection.uniqueKeys())
Retrieve an array containing all unique keys of the collection (index or primary key depending on where() clause)

#### [until()](/docs/Collection/Collection.until())
Ignores items occurring after given filter returns true.
