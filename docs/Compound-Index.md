---
layout: docs
title: 'Compound Index'
---

A compound (or composite) index is an index based on several keypaths. It can be used to efficiently index multiple properties in one index to easily find the existance of the combination of two keys and their values.

In Dexie, a compound index must be specified when defining the schema:

```javascript
var db = new Dexie('dbname');
db.version(1).stores({
    people: 'id, [firstName+lastName]'
});
```

In the above sample, records containing valid keys in the *firstName* and *lastName* properties will be indexed. If having stored an object with properties `{firstName: 'foo', lastName: 'bar'}`, it can be efficiently looked up using:

```javascript
db.people.where('[firstName+lastName]').equals(['foo', 'bar'])
```

...which can also be expressed as:

```javascript
db.people.where({firstName: 'foo', lastName: 'bar'})`
```

The latter version is a special case that only works in Dexie >=2.0 and that can match by multiple properties, no matter whether your browser supports compound queries or not.

## Sample

```javascript
async function playWithCompoundIndex() {

    // Store person
    await db.people.put({
        id: 1,
        firstName: 'foo',
        lastName: 'bar'
    });
    
    // Query person:
    const fooBar = await db.people.where({
      firstName: 'foo',
      lastName: 'bar'
    }).first();
    
    // Show result
    console.log ("Foobar: ", fooBar.id, fooBar.firstName, fooBar.lastName);
}

```

## How Compound Index Works
A compound index can be viewed as the index of a concatenation of two properties. They are expressed as "[prop1+prop2]" both when declaring them and when referring to them in where()-clauses. It's not exactly just a string-concatenation, since the properties may be of different types, but it's one way to think about them.

## Matching First Part Only
To find all friends with `firstName='foo'` but has an arbritary lastName, we actually do not need to use a normal index - a compound index who's first part is 'firstName' can also perform this query. For the compound index '[firstName+lastName]', the query should be expressed as follows:

```javascript
db.people
  .where('[firstName+lastName]').between(
    ["foo", Dexie.minKey],
    ["foo", Dexie.maxKey])
  .toArray();
```

# Compound Primary Key

A primary key can also be compound in the same manner as indexes. However, a compound primary key cannot be auto-incremented of natural reasons.

```javascript
var db = new Dexie('dbname');
db.version(1).stores({
    people: '[date+firstName+lastName], ...'
});
```

The above sample uses a compound primary key containing four properties: date, firstName and lastName.

# Browser limitations

Internet Explorer, Edge and Safari < v10 does not support compound indexes or primary keys.

# Using with orderBy()

If an index is compound using "[firstName+lastName]", [Table.orderBy()](/docs/Table/Table.orderBy()) will sort the contents based on firstName first and lastname secondary. Reverse the order of the compound entries to sort by lastName first. The sorting does not only apply when using "orderBy()" but also when using a [WhereClause](/docs/WhereClause/WhereClause) targeting the compound index, such as:


```javascript
db.version(x).stores({
    people: '++id, [lastName+firstName]'
});

db.people.where('[lastName+firstName]').between(['A', ''], ['B','']).toArray();
```

The above query will list all people who has a lastName starting with letter 'A'. Result will be sorted by lastName first and firstName secondly when people have the same lastName but different firstName. Notice that you cannot use that compound key to sort by firstName first. Must add another index with a reversed order of the properties to accomplish that. Notice also that if any person lacks either of the properties, it will not be contained in the result. Compound indexes will only index objects that has valid keys for all contained keypaths.

# Multiple Combinations 

If your app needs to support several ways of sorting, you can add several combinations of the same properties, thus adding several indexes based on different combinations of the order of your properties.

```javascript
db.version(x).stores({
    // Sorting by either prop
    people: '++id, [firstName+lastName], [lastName+firstName]'
});
```
