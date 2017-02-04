---
layout: docs
title: 'WhereClause'
---

Represents a filter on an index or primary key.

### Sample

```javascript
db.friends.where("shoeSize").between(40, 45).count(function(count) {
    console.log("I have " + count + " friends with the shoe size between 40 and 45");
});
```

### Methods

#### [above()](/docs/WhereClause/WhereClause.above())
Returns a collection of objects where index is above given key

#### [aboveOrEqual()](/docs/WhereClause/WhereClause.aboveOrEqual())
Returns a collection of objects where index is above or equal given key

#### [anyOf()](/docs/WhereClause/WhereClause.anyOf())
Returns a collection of objects where index is equal to any of the keys in given array

#### [anyOfIgnoreCase()](/docs/WhereClause/WhereClause.anyOfIgnoreCase())
Returns a collection of objects where index matches any of given strings, ignoring case differences.

#### [below()](/docs/WhereClause/WhereClause.below())
Returns a collection of objects where index is below given key

#### [belowOrEqual()](/docs/WhereClause/WhereClause.belowOrEqual())
Returns a collection of objects where index is below or equal given key

#### [between()](/docs/WhereClause/WhereClause.between())
Returns a collection of objects where index is between given boundaries

#### [equals()](/docs/WhereClause/WhereClause.equals())
Returns a collection of objects where index equals given key

#### [equalsIgnoreCase()](/docs/WhereClause/WhereClause.equalsIgnoreCase())
Returns a collection of objects where index equals given string-key ignoring case differences

#### [inAnyRange()](/docs/WhereClause/WhereClause.inAnyRange())
Returns a collection where index is within any of the given ranges.

#### [noneOf()](/docs/WhereClause/WhereClause.noneOf())
Returns a collection where index equals anything but any of the keys in given array

#### [notEqual()](/docs/WhereClause/WhereClause.notEqual())
Returns a collection where index equals anything but given value

#### [startsWith()](/docs/WhereClause/WhereClause.startsWith())
Returns a collection of objects where index starts with given string-key

#### [startsWithAnyOf()](/docs/WhereClause/WhereClause.startsWithAnyOf())
Returns a collection of objects where index starts with any of the given strings

#### [startsWithIgnoreCase()](/docs/WhereClause/WhereClause.startsWithIgnoreCase())
Returns a collection of objects where index starts with given string-key ignoring case differences

#### [startsWithAnyOfIgnoreCase()](/docs/WhereClause/WhereClause.startsWithAnyOfIgnoreCase())
Returns a collection of objects where index starts with any of given strings, ignoring case differences

### See Also

[Table.where()](/docs/Table/Table.where()) - the method that returns a WhereClause instance.

[Collection](/docs/Collection/Collection) - where you can continue filtering your query

