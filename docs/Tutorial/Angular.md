---
layout: docs
title: 'Get started with Dexie in Angular'
---
{% raw %}

<div style="opacity: 0.8; padding: 40px 0 40px 0">
  <img src="/assets/images/angular.svg" style="width:50px;margin: 0 10px 0 0">
  <span>+</span>
  <img src="/assets/images/logo-dexie-black.svg" style="width: 200px;">    
</div>

# 1. Create an Angular project

Here we refer to Angular's own [Getting Started](https://angular.io/start) page.

<br/>

# 2. Install dexie

```
npm install dexie
```

# 3. Create a file `db.ts`

Applications typically have one single Dexie instance declared as its own module. This is where you declare which tables you need and how each table shall be indexed. A Dexie instance is a singleton throughout the application - you do not need to create it on demand. Export the resulting `db` instance from your module so that you can use it from your services to write or query data.

To make the best Typescript experience with Dexie.js, table properties (such as `db.todoLists` and `db.todoItems`) needs to be explicitely declared on a subclass of Dexie just to help out with the typings for your db instance, its tables and entity models.

```ts
// db.ts
import Dexie, { Table } from 'dexie';

export interface TodoList {
  id?: number;
  title: string;
}
export interface TodoItem {
  id?: number;
  todoListId: number;
  title: string;
  done?: boolean;
}

export class AppDB extends Dexie {
  todoItems!: Table<TodoItem, number>;
  todoLists!: Table<TodoList, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      todoLists: '++id',
      todoItems: '++id, todoListId',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    const todoListId = await db.todoLists.add({
      title: 'To Do Today',
    });
    await db.todoItems.bulkAdd([
      {
        todoListId,
        title: 'Feed the birds',
      },
      {
        todoListId,
        title: 'Watch a movie',
      },
      {
        todoListId,
        title: 'Have some sleep',
      },
    ]);
  }
}

export const db = new AppDB();

```

# 4. Turn App component into an Offline ToDo app

In this sample we will use two components that builds up our ToDo application. For simplicity, we are letting our components talk directly to the db here. In a real application you might prefer to put the database action and queries via services.

```ts
// app.component.ts
import { Component, VERSION } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, TodoList } from '../db';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todoLists$ = liveQuery(() => db.todoLists.toArray());
  listName = 'My new list';

  async addNewList() {
    await db.todoLists.add({
      title: this.listName,
    });
  }

  identifyList(index: number, list: TodoList) {
    return `${list.id}${list.title}`;
  }
}
```

```html
<!-- app.component.html -->
<h1>A very simple liveQuery() example</h1>

<div *ngFor="let todoList of todoLists$ | async; trackBy: identifyList">
  <itemlist [todoList]="todoList"></itemlist>
</div>
<label>
  Add new list:
  <input
    autocomplete="off"
    type="text"
    id="name"
    #name
    [(ngModel)]="listName"
  />
</label>
<button type="submit" (click)="addNewList()">Add new list</button>

```

# 5. Add the ItemList component

```ts
// itemlist.component.ts
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, Item, TodoItem, TodoList } from '../db';

@Component({
  selector: 'itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.css'],
})
export class ItemListComponent {
  @Input() todoList: TodoList;
  // Observe an arbritary query:
  todoItems$ = liveQuery(
    () => this.listTodoItems()
  ); 

  async listTodoItems() {
    return await db.todoItems
      .where({
        todoListId: this.todoList.id,
      })
      .toArray();
  }

  async addItem() {
    await db.todoItems.add({
      title: this.itemName,
      todoListId: this.todoList.id,
    });
  }

  itemName = 'My new item';
}
```

```html
<!-- itemlist.component.html -->
<h3>{{ todoList.title }}</h3>

<!--
    Adding item form
-->
<label>
  Add item:
  <input
    autocomplete="off"
    type="text"
    id="name"
    #name
    [(ngModel)]="itemName"
  />
</label>
<button type="submit" (click)="addItem()">Add ToDo</button>

<!--

    Rendering todoItems$

-->
<ul>
  <li *ngFor="let item of todoItems$ | async">
    {{ item.title }}
  </li>
</ul>

```

# 6. Put it together

```ts
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ItemListComponent } from './itemlist.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, ItemListComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

[Click here to see this component live](https://angular-ivy-4666q1.stackblitz.io)

[Click here to play around in the source](https://stackblitz.com/edit/angular-ivy-4666q1?file=src%2Fapp%2Fapp.module.ts)

{% endraw %}
