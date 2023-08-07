---
layout: docs
title: 'MultiEntry Index'
---

A multiEntry index in indexedDB is an index that refers to an array property, and where each item in the array is indexed towards the object / record / document. It is similar to GIN index in PostgreSQL. 

In Dexie, an index is marked multiEntry by putting an asterisk (*) char in front of the index name in the schema as exemplified below:

```javascript
var db = new Dexie('dbname');
db.version(1).stores ({
  books: 'id, author, name, *categories'
});
```

In this sample, books can be categorized by multiple categories. This is done by letting the book objects have an array property named 'categories' containing the category strings. See sample below:

```javascript
db.books.put({
  id: 1,
  name: 'Under the Dome', 
  author: 'Stephen King',
  categories: ['sci-fi', 'thriller']
});

```
In the sample, we add a book with the multiple categories "sci-fi" and "thriller". Note that not just strings can be put in the array, but any [Indexable types](/docs/Indexable-Type) are valid.

# Querying MultiEntry Indexes

All [WhereClause](/docs/WhereClause/WhereClause) operators are available for querying MultiEntry indexed objects. However, the operator's behaviours are not that intuitive as they are for normal indexes. For example, one should use [WhereClause.equals()](/docs/WhereClause/WhereClause.equals()) operator to query books is of a certain category, while a more semantic name would probably be `contains()`. The reason for this is to map with the way indexedDB works natively, and also to allow any operator and not tie multiEntry indexes to certain operators.

```javascript

// Query all sci-fi books:
function getSciFiBooks() {
  return db.books
    .where('categories').equals('sci-fi')
    .toArray ();
}

```

## The distinct() operator

When querying multiEntry indexes, chances are that one may get multiple results of the same objects, if there are multiple index matches for the same item. It is therefore a good practice to always use [Collection.distinct()](/docs/Collection/Collection.distinct()) in queries on multiEntry indexes.

## Samples in Summary

```javascript

// Define DB
var db = new Dexie('dbname');
db.version(1).stores ({
  books: 'id, author, name, *categories'
});

// Insert a book of multiple categories
db.books.put({
  id: 1,
  name: 'Under the Dome', 
  author: 'Stephen King',
  categories: ['sci-fi', 'thriller']
});

// Query all sci-fi books:
function getSciFiBooks() {
  return db.books
    .where('categories').equals('sci-fi')
    .toArray ();
}

// Query all books of category 'sci-fi' or 'romance'
function getSciFiOrRomanceBooks() {
  return db.books
    .where('categories').anyOf('sci-fi', 'romance')
    .distinct() // Never show 2 results of same book with both romance and sci-fi
    .toArray()
}

// Complex query
function complexQuery() {
  return db.books
    .where('categories').startsWithAnyOfIgnoreCase('sci', 'ro')
    .or('author').equalsIgnoreCase('stephen king')
    .distinct()
    .toArray();
}

```

# Limitations

* A [compound index](/docs/Compound-Index) cannot be marked MultiEntry. The limitation lies within indexedDB itself.
* Of natural reasons, primary keys cannot be marked MultiEntry.

# Browser limitations

The following browsers does not support multiEntry indexes:

* Internet Explorer 10, 11
* Non-chromium based Microsoft Edge browsers
* Safari 8, 9.
