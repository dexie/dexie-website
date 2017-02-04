---
layout: docs
title: 'WhereClause'
---
Represents a filter on an index or primary key.

### Sample

    db.friends.where("shoeSize").between(40, 45).count(function(count) {
        console.log("I have " + count + " friends with the shoe size between 40 and 45");
    });

### Methods

#### [above()](WhereClause.above())
Returns a collection of objects where index is above given key

#### [aboveOrEqual()](WhereClause.aboveOrEqual())
Returns a collection of objects where index is above or equal given key

#### [anyOf()](WhereClause.anyOf())
Returns a collection of objects where index is equal to any of the keys in given array

#### [anyOfIgnoreCase()](WhereClause.anyOfIgnoreCase())
Returns a collection of objects where index matches any of given strings, ignoring case differences.

#### [below()](WhereClause.below())
Returns a collection of objects where index is below given key

#### [belowOrEqual()](WhereClause.belowOrEqual())
Returns a collection of objects where index is below or equal given key

#### [between()](WhereClause.between())
Returns a collection of objects where index is between given boundaries

#### [equals()](WhereClause.equals())
Returns a collection of objects where index equals given key

#### [equalsIgnoreCase()](WhereClause.equalsIgnoreCase())
Returns a collection of objects where index equals given string-key ignoring case differences

#### [inAnyRange()](WhereClause.inAnyRange())
Returns a collection where index is within any of the given ranges.

#### [noneOf()](WhereClause.noneOf())
Returns a collection where index equals anything but any of the keys in given array

#### [notEqual()](WhereClause.notEqual())
Returns a collection where index equals anything but given value

#### [startsWith()](WhereClause.startsWith())
Returns a collection of objects where index starts with given string-key

#### [startsWithAnyOf()](WhereClause.startsWithAnyOf())
Returns a collection of objects where index starts with any of the given strings

#### [startsWithIgnoreCase()](WhereClause.startsWithIgnoreCase())
Returns a collection of objects where index starts with given string-key ignoring case differences

#### [startsWithAnyOfIgnoreCase()](WhereClause.startsWithAnyOfIgnoreCase())
Returns a collection of objects where index starts with any of given strings, ignoring case differences

### See Also
[Table.where()](Table.where()) - the method that returns a WhereClause instance.

[Collection](Collection) - where you can continue filtering your query

