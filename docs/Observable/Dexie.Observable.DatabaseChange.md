---
layout: docs
title: 'Dexie.Observable.DatabaseChange'
---

Structure of database change object.

## Properties

<table>
<tr><td>rev : Number</td><td>The revision of this change</td></tr>
<tr><td>type: Number</td><td>Type of change. 1=CREATED, 2=UPDATED, 3=DELETED</td></tr>
<tr><td>key : any</td><td>Primary key of changed object</td></tr>
<tr><td>table : String</td><td>Table name of where the change took place</td></tr>
<tr><td>obj: Object</td><td>Contains the created or updated object. Provided only if type=1 or 2 (CREATED or UPDATED) . </td></tr>
<tr><td>mods: Object</td><td>Contains a set of key paths (property names or dotted property names) and values that has been modified in the object. Provided only if type=2 (UPDATED)</td></tr>
<tr><td>oldObj: Object</td><td>Contains the object as it was before the change. Provided only if type=2 (UPDATED) or 3 (DELETED).</td></tr>
<tr><td>source : any</td><td>(Optional) Source of the modification. If the ´source´ property of the <a href="../Transaction/Transaction">Transaction</a> object was set to a value while performing a database operation, this value will be put in the change object. The ´source´ property is not an official property of <a href="../Transaction/Transaction">Transaction</a> but is added to all transactions when Dexie.Observable is active. The property can be used to ignore certain changes that origin from self.</td></tr> 
</table>

## See Also

[Dexie.Observable.js](/docs/Observable/Dexie.Observable)
