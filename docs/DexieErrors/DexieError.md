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
  * [RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
  * Dexie.DexieError
    * [Dexie.AbortError](/docs/DexieErrors/Dexie.AbortError)
    * [Dexie.BulkError](/docs/DexieErrors/Dexie.BulkError)
    * [Dexie.ConstraintError](Dexie.ConstraintError)
    * [Dexie.DatabaseClosedError](/docs/DexieErrors/Dexie.DatabaseClosedError)
    * [Dexie.DataCloneError](/docs/DexieErrors/Dexie.DataCloneError)
    * [Dexie.DataError](/docs/DexieErrors/Dexie.DataError)
    * *[Dexie.IncompatiblePromiseError](/docs/DexieErrors/Dexie.IncompatiblePromiseError)  (Obsolete since v2.0.0)*
    * [Dexie.InternalError](/docs/DexieErrors/Dexie.InternalError)
    * [Dexie.InvalidAccessError](/docs/DexieErrors/Dexie.InvalidAccessError)
    * [Dexie.InvalidArgumentError](/docs/DexieErrors/Dexie.InvalidArgumentError)
    * [Dexie.InvalidStateError](/docs/DexieErrors/Dexie.InvalidStateError)
    * [Dexie.InvalidTableError](/docs/DexieErrors/Dexie.InvalidTableError)
    * [Dexie.MissingAPIError](/docs/DexieErrors/Dexie.MissingAPIError)
    * [Dexie.ModifyError](/docs/DexieErrors/Dexie.ModifyError)
    * [Dexie.NoSuchDatabaseError](/docs/DexieErrors/Dexie.NoSuchDatabaseError)
    * [Dexie.NotFoundError](/docs/DexieErrors/Dexie.NotFoundError)
    * [Dexie.OpenFailedError](/docs/DexieErrors/Dexie.OpenFailedError)
    * [Dexie.QuotaExceededError](/docs/DexieErrors/Dexie.QuotaExceededError)
    * [Dexie.PrematureCommitError](/docs/DexieErrors/Dexie.PrematureCommitError)
    * [Dexie.ReadOnlyError](/docs/DexieErrors/Dexie.ReadOnlyError)
    * [Dexie.SchemaError](/docs/DexieErrors/Dexie.SchemaError)
    * [Dexie.SubTransactionError](/docs/DexieErrors/Dexie.SubTransactionError)
    * [Dexie.TimeoutError](/docs/DexieErrors/Dexie.TimeoutError)
    * [Dexie.TransactionInactiveError](/docs/DexieErrors/Dexie.TransactionInactiveError)
    * [Dexie.UpgradeError](/docs/DexieErrors/Dexie.UpgradeError)
    * [Dexie.UnknownError](/docs/DexieErrors/Dexie.UnknownError)
    * [Dexie.UnsupportedError](/docs/DexieErrors/Dexie.UnsupportedError)
    * [Dexie.VersionChangeError](/docs/DexieErrors/Dexie.VersionChangeError)
    * [Dexie.VersionError](/docs/DexieErrors/Dexie.VersionError)

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
    console.error ("Other unknown error caught: " + e);
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
<tr><td>name: string</td><td>Name of the error</td></tr>
<tr><td>message: string</td><td>Detailed message</td></tr>
<tr><td>inner?: any</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack?: string</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>

### Catching Errors Affect Transaction

If explicitly catching an error, the ongoing transaction will NOT abort. If that is not your desire, for example if you are just catching the error for logging purpose, you should rethrow the error after logging it.

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
