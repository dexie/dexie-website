---
layout: docs
title: 'db.syncable.setFilter()'
---

**NOTE: This method is NOT implemented, and is subject for change!**

### Syntax

```javascript
db.syncable.setFilter([criteria], filter);
```

### Parameters

<table>
<tr><td>criterion: Object</td><td><i>optional</i> Criterion of which table, url and protocol that the filter should apply: {<br/>
&nbsp;&nbsp;table: String (table name)<br/>
&nbsp;&nbsp;url: String (URL of sync server)<br/>
&nbsp;&nbsp;protocol: String (protocol name)<br/>
}
</td></tr>
<tr><td>filter: Function</td><td>Filter function taking an object instance and returning true (allow sync) or false (no sync) for given object.</td></tr>
</table>

### Description

Specifies a filter that defines whether an object should be synced or not. This feature makes it possible to let part of the local data be considered offline-only and neither be sent to remote sync peers, or be wiped out in case a remote sync peer needs to re-sync the client using the clear flag in the ISyncProtocol specification.

The filter will apply in the following scenarios:
 1. When sending changes to server, objects where filter returns false wont be sent.
 2. If server was out-of-sync and requests a local clear of all client data ([See clear flag in ISyncProtocol](/docs/Syncable/Dexie.Syncable.ISyncProtocol#applyremotechanges--function-changes-lastrevision-partial-clear), objects where filter returns false wont be wiped out.
 3. Whenever an object is updated, it is tested against the filter before and after the change. If that results in that the filter outcome turns from false to true, an CREATE change will be triggered. If it results in that the filter outcome turns from true to false, a DELETE change will be triggered.

Calling db.syncable.setFilter() twice with the same criterion will remove previous criterion (not add another criterion). For example if doing the following calls below, the first filter will only apply for all tables except the pets table:

```javascript
db.syncable.setFilter(function(obj){return !obj.localOnly;});
db.syncable.setFilter({table: "pets"}, function(obj){return true;});
```

_NOTE: There are two implicit filters already defined that prohibit any table starting with underscore or dollar to be synced. The reason for this implicit rule is that Dexie.Syncable and Dexie.Observable stores its state in tables starting with underscore._

### Samples

```javascript
db.syncable.setFilter(function (obj) {
    return !obj.keepLocal;
});
```

The above sample states that if an object has a property named ´keepLocal´ that is truthy, then the object will be considered local only and never become synced to any remote server. If the object's offline property is changed from a truthy to a falsy value, the framework will generate a CREATE change for that object (since it will be considered a creation in the perspective of the remote sync peer). Vice versa, if the offline property is set to truthy value, the framework will generate a DELETE change for the object.

***

```javascript
db.syncable.setFilter({table: "friends"}, function (obj) {
    return !obj.isCloseFriend;
});
```

The above sample will only apply to the 'friends' table. Close friends will never be synchronized. Existing friends that turn into close friends will be deleted from remote nodes.

***

```javascript
db.syncable.setFilter({table: "friends"}, function (obj) {
    return !obj.isCloseFriend;
});
db.syncable.setFilter({table: "pets"}, function (obj) {
    return obj.kind != "dog";
});
```

Above example: Dogs and close friends will be kept locally.

***

```javascript
db.syncable.setFilter({table: "localSettings"}, function () {return false;});
```

Above example: The "localSettings" table will never be synced. _NOTE: For performance reasons, it is better to name a table with a leading underscore or dollar sign rather than applying the above filter. The reason for this is implicit rule in Dexie.Observable.js that makes sure that table names starting with _ or $ will neither be observed or synced. By neither observing or syncing the tables you will gain much performance benefits._

***

```javascript
db.syncable.setFilter({url: "*"}, function(){return false;});
db.syncable.setFilter({url: "https://*"}, function(){return true;});
```

Above example: Only allow sync towards URLs starting with "https://".

***

```javascript
db.syncable.setFilter({
    table: "friends",
    protocol: "websocket"
}, function (obj) {
    return !obj.isCloseFriend;
});
```

Above example: For websocket protocol only, don't sync close friends.
