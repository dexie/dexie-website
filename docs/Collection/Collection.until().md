---
layout: docs
title: 'Collection.until()'
---

Stop iterating the collection once given filter returns true.

### Syntax

```javascript
collection.until(filterFunction, bIncludeStopEntry)
```

### Parameters
<table>
<tr><td>filterFunction: Function</td><td>function (item) {} that when returns a truthy value will stop the rest of the iteration</td></tr>
<tr><td>bIncludeStopEntry: Boolean</td><td><i>(Optional)</i> If true, the collection will include the stop entry on which the filter function returns true</td></tr>
</table>

### Remarks

Works similar to [limit()](/docs/Collection/Collection.limit()) but rather than specifying a number, you specify a filter function to execute on each item and when it returns true, the iteration will stop.

### Sample

```javascript
let cancelled = false;

function getLogs() {
    cancelled = false;
    return db.logEntries
        .where('date').between(yesterday, today)
        .until(() => cancelled)
        .toArray();
}

// To cancel the iteration, set cancelled = true
function cancel() {
    cancelled = true;
}
```

### Return Value

This Collection instance (**this**)
