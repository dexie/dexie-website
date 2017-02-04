---
layout: docs
title: 'Table Schema'
---
### Syntax

    function TableSchema(name, primKey, indexes, instanceTemplate) {
        /// <param name="name" type="String"></param>
        /// <param name="primKey" type="IndexSpec"></param>
        /// <param name="indexes" type="Array" elementType="IndexSpec"></param>
        /// <param name="instanceTemplate" type="Object"></param>
        this.name = name;
        this.primKey = primKey;
        this.indexes = indexes;
        this.instanceTemplate = instanceTemplate;
        this.mappedClass = null;
    }

### Properties

#### indexes : Array&lt;[IndexSpec](IndexSpec)&gt;
List of indexes properties.

#### instanceTemplate : Object
Object populated with indexed properties. In case [Table.defineClass()](Table.defineClass()) or [Table.mapToClass()](Table.mapToClass()) has been used, also non-indexed properties will be part of the template.

This property is used internally by Dexoe to help out IDE with code completion.

#### mappedClass : Function
In case [Table.defineClass()](Table.defineClass()) or [Table.mapToClass()](Table.mapToClass()) has been used, the mapped constructor function will be stored in this property.

#### name : String
The name of the object store.

#### primKey : [IndexSpec](IndexSpec)
Specification of primary key.

### Description

Primary key and indexes for the object store ([Table](Table)).

### Sample

    var db = new Dexie("MyDB");
    db.version(1).stores({friends: "++id,name"});

    alert ("Primary key: " + db.friends.schema.primKey.keyPath); // Will alert ("id");
