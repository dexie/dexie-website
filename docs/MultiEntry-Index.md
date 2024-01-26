---
layout: docs
title: 'MultiEntry Index'
---

A multiEntry index in indexedDB is an index that refers to an array property, and where each item in the array is indexed towards the object / record / document. It is similar to GIN index in PostgreSQL.

MultiEntry indexes are declared as `ArrayOf(Index())` as examplified below...

```ts
import { CompoundPrimKey, Index, ArrayOf } from 'dreamtype';

export class Book {
  author = CompoundPrimKey(String, () => this.name);
  name = Index(String);
  categories = ArrayOf(Index(String)); // MultiEntry index = Array of indexed items
}

export const db = new Dexie('dbname').stores({
  books: Book
});
```

## Classical declaration

An index can be marked multiEntry by putting an asterisk (\*) char in front of the index name in the schema as exemplified below:

```ts
export const db = new Dexie('dbname');
db.version(1).stores({
  books: 'id, name, author, *categories'
});
```

With legacy declaration style (backward compatible with dexie <= 4), an index can be marked multiEntry by putting an asterisk (\*) char in front of the index name in the schema as exemplified below:

```javascript
export const db = new Dexie('dbname').version(2).stores({
  books: 'id, name, author, *categories'
});
```

In this sample, books can be categorized by multiple categories. This is done by letting the book objects have an array property named 'categories' containing the category strings. See sample below:

```javascript
await db.books.put({
  id: 1,
  name: 'Under the Dome',
  author: 'Stephen King',
  categories: ['sci-fi', 'thriller']
});
```

In the sample, we add a book with the multiple categories "sci-fi" and "thriller". Note that not just strings can be put in the array, but any [Indexable types](/docs/Indexable-Type) are valid.

# Querying MultiEntry Indexes

All [WhereClause](/docs/WhereClause/WhereClause) operators are available for querying MultiEntry indexed objects. However, the operator's behaviours are not that intuitive as they are for normal indexes. For example, one should use [WhereClause.equals()](</docs/WhereClause/WhereClause.equals()>) operator to query books is of a certain category, while a more semantic name would probably be `contains()`. The reason for this is to map with the way indexedDB works natively, and also to allow any operator and not tie multiEntry indexes to certain operators.

```javascript
// Query all sci-fi books:
export function getSciFiBooks() {
  return db.books.where('categories').equals('sci-fi').toArray();
}
```

## The distinct() operator

When querying multiEntry indexes, chances are that one may get multiple results of the same objects, if there are multiple index matches for the same item. It is therefore a good practice to always use [Collection.distinct()](</docs/Collection/Collection.distinct()>) in queries on multiEntry indexes.

## Samples in Summary

```ts
import { PrimKey, Index, ArrayOf, Dexie } from 'dexie';

// Define Book
export class Book {
  id = PrimKey(String);
  name = Index(String);
  author = Index(String);
  categories = ArrayOf(Index(String)); // MultiEntry index
}

// Define db
export const db = new Dexie('dbname').stores({
  books: Book
});

// Insert a book of multiple categories
export function addBook(
  id: string,
  name: string,
  author: string,
  categories: string[]
): Promise<string> {
  return db.books.put({
    id,
    name,
    author,
    categories
  });
}

// Query all sci-fi books:
export function getSciFiBooks(): Promise<Book[]> {
  return db.books.where('categories').equals('sci-fi').toArray();
}

// Query all books of category 'sci-fi' or 'romance'
export function getSciFiOrRomanceBooks(): Promise<Book[]> {
  return db.books
    .where('categories')
    .anyOf('sci-fi', 'romance')
    .distinct() // Never show 2 results of same book with both romance and sci-fi
    .toArray();
}

// Complex query
export function complexQuery(): Promise<Book[]> {
  return db.books
    .where('categories')
    .startsWithAnyOfIgnoreCase('sci', 'ro')
    .or('author')
    .equalsIgnoreCase('stephen king')
    .distinct()
    .toArray();
}
```

# Limitations

- A [compound index](/docs/Compound-Index) cannot be marked MultiEntry. The limitation lies within indexedDB itself.
- Of natural reasons, primary keys cannot be marked MultiEntry.
