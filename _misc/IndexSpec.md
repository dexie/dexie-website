---
layout: docs
title: 'IndexSpec'
---

### Syntax

```javascript
function IndexSpec(name, keyPath, unique, multi, auto, compound) {
  /// <param name="name" type="String"></param>
  /// <param name="keyPath" type="String"></param>
  /// <param name="unique" type="Boolean"></param>
  /// <param name="multi" type="Boolean"></param>
  /// <param name="auto" type="Boolean"></param>
  /// <param name="compound" type="Boolean"></param>
  this.name = name;
  this.keyPath = keyPath;
  this.unique = unique;
  this.multi = multi;
  this.auto = auto;
  this.compound = compound;
  this.src = (unique ? '&' : '') + (multi ? '*' : '') + (auto ? "++" : "") + keyPath;
}
```

### Properties

#### auto : Boolean

This property only applies to primary keys. If true, the primary key will be auto-incremented.

#### compound : Boolean

True if the index or primary key is a combination of two or more properties. In that case, keyPath is an array of strings. _Note: This property is not supported by IE_

#### keyPath : String

Key path of the index. For direct properties, keyPath is the property name. For nestled properties, keyPath will be the path to the nestled key using property names and periods, such as ´"props.shoeSize"´ for an object with structure:

```javascript
{
    props: {
        shoeSize: 47
    }
}
```

For compound indexes, `keyPath` is an array of the keyPaths of the compound indexes while `name` is the String as it was defined in [Version.stores()](/docs/Version/Version.stores()).

#### multi : Boolean

If true and keyPath points out an array, each item in the array will be indexed. _Note: This property is not supported by IE_.

#### name : String

The name of the index. Unless this is a compound index, name will always equal keyPath.

For compound indexes, `name` is the String as it was defined in [Version.stores()](/docs/Version/Version.stores()) while `keyPath` is an array of the keyPaths of the compound indexes while.

#### src : String

Canonical syntax generating this indexSpec. Since this property is canonical, we use it internally to compare index specifications in different versions to notice when they change. This is used in the upgrade framework.

#### unique : Boolean

True if index must be unique. Does not apply to primary keys since they are always unique in their nature.

### Description

Specification of an index or primary key.

### Sample

```javascript
var db = new Dexie("MyDB");
db.version(1).stores({friends: "++id,name"});

alert ("Primary key: " + db.friends.schema.primKey.auto); // Will alert (true);
```

### See Also

[TableSchema](/docs/TableSchema)

[Version.stores()](/docs/Version/Version.stores())
