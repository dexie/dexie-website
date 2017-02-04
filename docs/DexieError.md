---
layout: docs
title: 'DexieError'
---
*since v.1.3.3*

```javascript
class DexieError extends Error {}
```
Acts as the base class for exceptions that can be returned in rejected Dexie promises.

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [SyntaxError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)
  * [TypeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
  * Dexie.DexieError
    * [Dexie.AbortError](Dexie.AbortError)
    * [Dexie.BulkError](Dexie.BulkError)
    * [Dexie.ConstraintError](Dexie.ConstraintError)
    * [Dexie.DatabaseClosedError](Dexie.DatabaseClosedError)
    * [Dexie.DataCloneError](Dexie.DataClonError)
    * [Dexie.DataError](Dexie.DataError)
    * *[Dexie.IncompatiblePromiseError](Dexie.IncompatiblePromiseError)  (Obsolete since v2.0.0)*
    * [Dexie.InternalError](Dexie.InternalError)
    * [Dexie.InvalidAccessError](Dexie.InvalidAccessError)
    * [Dexie.InvalidArgumentError](Dexie.InvalidArgumentError)
    * [Dexie.InvalidStateError](Dexie.InvalidStateError)
    * [Dexie.InvalidTableError](Dexie.InvalidTableError)
    * [Dexie.MissingAPIError](Dexie.MissingAPIError)
    * [Dexie.ModifyError](Dexie.ModifyError)
    * [Dexie.NoSuchDatabaseError](Dexie.NoSuchDatabaseError)
    * [Dexie.NotFoundError](Dexie.NotFoundError)
    * [Dexie.OpenFailedError](Dexie.OpenFailedError)
    * [Dexie.QuotaExceededError](Dexie.QuotaExceededError)
    * [Dexie.PrematureCommitError](Dexie.PrematureCommitError)
    * [Dexie.ReadOnlyError](Dexie.ReadOnlyError)
    * [Dexie.SchemaError](Dexie.SchemaError)
    * [Dexie.SubTransactionError](Dexie.SubTransactionError)
    * [Dexie.TimeoutError](Dexie.TimeoutError)
    * [Dexie.TransactionInactiveError](Dexie.TransactionInactiveError)
    * [Dexie.UnknownError](Dexie.UnknownError)
    * [Dexie.UnsupportedError](Dexie.UnsupportedError)
    * [Dexie.VersionError](Dexie.VersionError)

### Sample

```javascript
doSomeDatabaseWork().then(function(){
    //
    // Success
    //
}).catch('ModifyError', function (e) {
    //
    // Failed with ModifyError. Check out e.failures
    //
    console.error ("ModifyError occurred: " + e.failures.length + " failures"); +
}).catch('ConstraintError', function (e) {
    //
    // Failed with ConstraintError
    //
    console.error ("Error: " + e.message);
}).catch(function (e) {
    //
    // Other error such as a string was thrown
    //
    console.error ("Other unknown error catched: " + e);
});
```

### Sample: switch(error.name)
```javascript
doSomeDatabaseWork().then(function(){
    // Success
}).catch(function (error) {
    switch (error.name) {
        case "UpgradeError": // or case Dexie.errnames.Upgrade: ...
            console.error ("Upgrade error");
            break;
        case "ModifyError": // or case Dexie.errnames.Modify: ...
            console.error ("Modify error");
            break;
        case ...

        default:
            console.error ("error: " + e);
    }
});
```
### Properties

<table>
<tr><td width="200">name: string</td><td>Name of the error</tr>
<tr><td>message: string</td><td>Detailed message</td></tr>
<tr><td>inner?: any</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack?: string</td><td>Can be present if the error was thown. If signaled, there wont be any call stack.</td></tr>
</table>

### Catching Errors Affect Transaction

If explicitely catching an error, the ongoing transaction will NOT abort. If that is not your desire, for example if you are just catching the error for logging purpose, you should rethrow the error after logging it.

The catch effect also applies when using yield or async / await and a standard try..catch.

### Sample of rethrowing error
```javascript

db.transaction('rw', db.friends, function() {
    db.friends.add({id: 1, name: "Orvar", age: 3}).catch(function (e) {
        console.error ("Could not add Orvar");
        throw e; // Rethrowing so that transaction is indeed aborted.
    });
});

// Or with yield
db.transaction('rw', db.friends, function*() {
    try {
        yield db.friends.add({id: 1, name: "Orvar", age: 3});
    } catch (e) {
        console.error ("Could not add Orvar");
        throw e; // Rethrowing so that transaction is indeed aborted.
    });
});
```
