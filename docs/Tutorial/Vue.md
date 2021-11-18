---
layout: docs
title: 'Get started with Dexie in Vue'
---
{% raw %}

<div style="opacity: 0.8; padding: 40px 0 40px 0">
  <img src="/assets/images/Vue.svg" style="width:50px;margin: 0 10px 0 0">
  <span>+</span>
  <img src="/assets/images/logo-dexie-black.svg" style="width: 200px;">    
</div>

# 1. Create a Vue project

Here we refer to Vue's own [Getting Started](https://vuejs.org/v2/guide/#Getting-Started) page.

<br/>

# 2. Install dexie

```
npm install dexie
```

# 3. Create a file `db.js` (or `db.ts`)

Applications typically have one single Dexie instance declared as its own module. This is where you declare which tables you need and how each table shall be indexed. A Dexie instance is a singleton throughout the application - you do not need to create it on demand. Export the resulting `db` instance from your module so that components or other modules can use it to query or write to the database.

```ts
// db.js
import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
  friends: '++id, name, age', // Primary key and indexed props
});

```

### Using Typescript?

If you use Typescript, table properties (such as `db.friends`) needs to be explicitely declared on a subclass of Dexie just to help out with the typings for your db instance, its tables and entity models.

```ts
// db.ts
import Dexie, { Table } from 'dexie';

export interface Friend {
  id?: number;
  name: string;
  age: number;
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  friends!: Table<Friend>; 

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      friends: '++id, name, age' // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();

```

# 4. Create a component that adds some data

Writing to the database can be done using [Table.add()](/docs/Table/Table.add()), [Table.put()](/docs/Table/Table.put()), [Table.update()](/docs/Table/Table.update()) and [Collection.modify()](/docs/Collection/Collection.modify()) - see Dexie's [quick reference](/docs/API-Reference#add-items) for examples. Here we're gonna create a simple Vue component that allows the user to add friends into the database using [Table.add()](/docs/Table/Table.add()).

```svelte
<!-- FriendAdder.vue -->
<template>
  <fieldset>
    <legend>Add new friend</legend>
    <label>
      Name:
      <input v-model="friendName" type="text" />
    </label>
    <br />
    <label>
      Age:
      <input v-model="friendAge" type="number" />
    </label>
    <br />
    <button @click="addFriend">Add Friend</button>
    <p>{{ status }}</p>
  </fieldset>
</template>

<script>
import { db } from '../db';

export default {
  name: 'FriendAdder',
  data: () => {
    return {
      status: '',
      friendName: '',
      friendAge: 21,
    };
  },
  methods: {
    async addFriend() {
      try {
        // Add the new friend!
        const id = await db.friends.add({
          name: this.friendName,
          age: this.friendAge,
        });

        this.status = `Friend ${this.friendName}
          successfully added. Got id ${id}`;

        // Reset form:
        this.friendName = '';
        this.friendAge = defaultAge;
      } catch (error) {
        this.status = `Failed to add
          ${friendName}: ${error}`;
      }
    },
  },
};
</script>

```

# 5. Create a component that queries data

Write a simple component that just renders all friends in the database.

To be able to consume the observable returned from Dexie's `liveQuery()`, we need to manage its subscription and unsubscription. For this sample, we use the hook useObservable() from @vueuse/rxjs.

```
npm install rxjs
npm install @vueuse/rxjs
```

Note that there are other ways to consume observables in vue - such as manually subscribe and unsubscribe in the lifecycle hooks if you prefer.

```svelte
<!-- FriendList.vue -->
<template>
  <ul>
    <li v-for="friend in friends" :key="friend.id">
      {{ friend.name }}, {{ item.age }}
    </li>
  </ul>
</template>

<script>
  import { liveQuery } from "dexie";
  import { useObservable } from "@vueuse/rxjs";
  import { db } from "./db";

  export default {
    name: "FriendList",
    setup() {
      return {
        db,
        items: useObservable(
          liveQuery(() => db.friends.toArray())
        ),
      };
    },
  };
</script>

```
*To make more detailed queries, refer to Dexie's [quick reference for querying items](/docs/API-Reference#query-items).*

# See also

[Sample Dexie/Vue app on codesandbox](https://codesandbox.io/s/vue-dexie-livequery-87exj?file=/src/components/DBItems.vue)

{% endraw %}
