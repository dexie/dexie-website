---
layout: docs-dexie-cloud
title: "Access Control in Dexie Cloud"
---

This page describes the access control model in Dexie Cloud.

If you are new to Dexie Cloud, please visit the [Dexie Cloud landing page](/cloud/).

If you prefer to jump right in to samples, here some shortcuts:

- [Sharable ToDo list](#example-sharable-todo-list)
- [Simple project managment model](#example-a-simple-project-management-model)

## Introduction

The server endpoint of Dexie Cloud controls access to data for every sync request, so that each user maintains a copy of the part of the database that is accessible for that user. It also controls what permissions each user has to mutate data.

The whole idea with Dexie Cloud is to create applications that work as identically as possible no matter if user is offline or online. This means that the application logic needs to stay on the client. A ToDo app must be able to add items while offline, a barcode scanner app must work offline and store scanned codes in the offline database.

Dexie Cloud comes with an access control model that has the same security benefits as a server side app, but the creation of the objects that control access happens in your client side app. How is this possible? It must all start with a user creating a realm. At first, this realm is nothing that affects other users. It does not harm anyone. The realm owner can create roles and invite members to the realm and connect the application model objects to the realm (or several different realms). Users that accepts the invitations will gain the access that the realm owner has given and the model continues to work with water-proof isolation between users and customers.

For enterprise use cases, Dexie Cloud also has a server side REST API that enables realm and bulk member management without requiring an invititation step. The client of such an API could typically sync users from a directiry with realm members in Dexie Cloud.

## Realms

A realm is an access controlled bucket of data. All objects in your database sits on a realm. Every user has a default realm that is private for that user only. By default, a newly created object will sit on the private realm for the user that creates the object.

New realms can be created by anyone but they are of little use unless that user invites members and the members accepts the invitation.

## Reserved property names

In all custom application tables, there are two reserved property names that affect access control:

- **realmId** - connects the object to a realm, making it visible (synced) for the members in the realm. If realmId is not specified, the current user's email will be used, which is a built-in realm that each user has. However, there are no realm objects representing these built-in realms.
- **owner** - connects the object to a user that gains full permissions on it. Ownership implies access to update and delete the object including changing realmId and owner properties, but it does not imply visibility (sync). If a member is removed from a realm, objects connected to that realm that are owned by the user will go out of scope for the user. If owner is not specified, it will default to the current user. If explicitely set to null, it will not have an owner.

## Default Access Control

In the simplest setup of Dexie Cloud, you do not need to specify anything related to access control. All data that one user creates will be private. It will sync to the cloud but not visible for any other user. This is still a valid use case since the data is continously backed up and possible to access from different devices for the same user.

#### Example: not specifying access control tables

```js
import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

const db = new Dexie("mySyncedDB", { addons: [dexieCloud] });
db.version(1).stores({
  todoLists: "@id, title",
  todoItems: "@id, title, done, todoListId",
});
```

_In this sample, we are only declaring application tables 'todoLists' and 'todoItems'. This is ok. Sync will work for each user, but users will not be able to share their lists with others_

## Access Control Tables

Access control is defined using the Dexie tables [realms](#table-realms), [members](#table-members) and [roles](#table-roles). To take advantage of these, just add them to your schema declaration. The server end-point will know how to handle these special tables if they are present.

```js
import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

const db = new Dexie("myDB", { addons: [dexieCloud] });
db.version(2).stores({
  // Application tables
  todoLists: "@id, title",
  todoItems: "@id, title, done, todoListId",

  // Access Control tables
  realms: "@realmId",
  members: "[realmId+email]",
  roles: "[realmId+name]",
});
```

_Access Control tables needs to be spelled exactly as in this sample and their primary keys needs to be spelled exactly the same. On top of that, you are free to index those properties you will need to query. The properties of objects in these tables are documented under each table below._

We will walk through how to use these tables to share objects to others.

### Table "realms"

Access Control are defined using realms. Each object you create belongs to a realm even if realm is not specified. Every user has its own private realm. Users can create new realms and invite other users to them. The id of a realm needs to be a globally unique string.

| Table Name | "realms" |
| Primary key | realmId |

By default, when adding objects to a table, it will implicitly get a "realmId" property pointing out the private realm of the current user. To make an object belong to a custom realm, just set the "realmId" property to the ID of the created realm.

You normally reuse the same realm for multiple objects to easily share all included objects atomically by adding members to your realm. Each member within a realm can also be given different permissions. Permissions can optionally be organized via roles.

#### Properties of objects in "realms" table

```ts
interface Realm {
  /** Primary key of the realm.
   */
  realmId: string;

  /** The name of the realm.
   *
   * This property is optional but it can be a good practice to name a realm for what it represents.
   */
  name?: string;

  /** Contains the email of the owner. An owner has implicit full write-access to the realm
   * and all obejcts connected to it. Ownership does not imply read (sync) access though,
   * so realm owners still needs to add themself as a member if they are going to use the realm
   * themselves.
   */
  owner?: string;
}
```

#### Example: Sharable ToDo list

This example shows how to create sharable entities, how to share them and how to connect related entities to it. It consists of three functions:

1. **createTodoList()** creates a sharable ToDo list
2. **shareTodoList()** shares the list to other users
3. **addTodoItem()** adds a todoItem related to the shared list

```js
import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

//
// Declare database, tables, keys and indexes
//
const db = new Dexie('myToDoDB', {addons: [dexieCloud]});
db.version(2).stores({
  // Application tables
  todoLists: '@id, title',
  todoItems: '@id, title, done, todoListId',

  // Access Control tables
  realms: '@realmId',
  members: '[realmId+email]',
  roles: '[realmId+name]'
});

//
// Example functions
//

/** Create a sharable ToDo list
 *
 * @param {string} listName Name of the ToDo list
 * @returns {Promise} Promise resolving with the ID of the created list.
 */
function createTodoList(listName) {
  return db.transaction('rw', db.todoLists, db.realms, db.members, async () => {

    // Create the new realm
    const newRealmId = await db.realms.add({
      // No required properties (other than the auto-generated key 'realmId')
      // But it could be wise to give it a name:
      name: `${listName} realm`
    });

    // Give yourself visibility of the realm and its connected objects
    // (being owner does not imply having the object synced)
    await db.members.add({
      realmId: newRealmId,
      email: db.cloud.currentUser.email,
      name: db.cloud.currentUser.name
      // invite not needed when sharing to yourself.
      // permissions not nescessary as you are the realm owner.
    });

    // Create the new list and connect it to this realm
    const newTodoListId = await db.todoLists.add({
      realmId: newRealmId,
      title: listName
    });

    // Return the ID. This becomes the return value of the transaction.
    return newTodoListId;
  });
}

/** Share ToDoList with some friends
 *
 * @param {Object} todoList
 * @param {Array.<{name: string, email: string}>} friends
 * @returns {Promise}
 */
function shareTodoList(todoList, ...friends) {
  return db.members.bulkAdd(friends.map(friend => ({
    realmId: todoList.realmId,
    email: friend.email,
    name: friend.name,
    invite: true, // Generates an invite email
    permissions: {
      manage: "*" // Give your friend full permissions within this new realm.
    }
  })));
}

/** Unshare ToDoList for given friends
 *
 * @param {Object} todoList
 * @param {Array.<{name: string, email: string}>} ...friends
 * @returns {Promise}
 */
function unshareTodoList(todoList, ...friends) {
  return db.members.bulkDelete(friends.map(friend => [todoList.realmId, friend.email]));
}

/** Add ToDo item
 *
 * @param {Object} todoList The TodoList object to connect the new toDo item to.
 * @param {string} todoTitle The title of the ToDo item.
 */
function addTodoItem(todoList, todoTitle) {
  return db.todoItems.add({
    todoListId: todoList.id, // Connect the item to the todoList
    realmId: todoList.realmId, // Connect it to the same realm
    title: todoTitle
    done: 0
  });
}
```

### Table "members"

Contains the edges between a realm and its members. Each member must have at least a realmId and an email property. Members can be added before the target user even has any user account in the system.

| Table Name | "members" |
| Primary key | [realmId+email] |

#### Properties of objects in "members" table

```ts
interface Member {
  realmId: string;
  email: string;
  name?: string;
  invite?: boolean;
  invited?: number; // date
  accepted?: number; // date
  roles?: string[];
  permissions?: {
    add?: string[] | "*"; // array of tables or "*" (all).
    update?: {
      [tableName: string]: string[] | "*"; // array of properties or "*" (all).
    };
    manage?: string[] | "*"; // array of tables or "*" (all).
  };
}
```

#### Permissions

**add**

Permission to add new objects to given set of tables. If a creator of an object may specify the "owner" property on to own email, the user will keep full permission on the object and be able to delete or update the object later on. If not specifying the "owner" property, the object gets out of ones hand after the creation is done.

Example

```js
{add: ["todoItems", "comments"]}
```

**update**

Permission to update given set of properties in given set of tables. Allowing "\*" will still not allow updating reserved properties `realmId` or `owner`. For example, if you have "update" permission on the "pets" table, you can change the pet's name but not its "owner" or "realmId".

Example

```js
{
  update: {
    todoLists: ["title"],
    todoItems: "*",
  }
}
```

**manage**

Full permissions on objects within the realm in given set of tables.

Example

```js
{manage: ["todoLists", "todoItems"]}
```

```js
{manage: "*"}
```

#### Default Membership flow

This is the typical flow for the non-enterprise use case in applications with a similar model as Slack, Github and ToDo list applications.

1. Client side: Add new object to the 'members' table with {invite: true}.
2. The changes are synced onto Dexie Cloud backend who will send an invite email to the added member.
3. User clicks link in email to accept the invitation.
4. User gains access: Next sync request from a device belonging to the user will start downloading data connected to the newly accepted realm.

#### Enterprise membership

If your app is targeting enterprise customers, a realm can represent an enterprise department or organisation and you might want to offer your customer to define access using their existing directory rather than having to invite all the employees manually.

Using the Dexie Cloud REST API, it is also possible to manage realms and members from a cloud function or service and by-pass the invite step.

### Table "roles"

Contains roles for each realm with predefined permissions. Users can then be assigned to roles and gain the permissions that comes with them.

| Table Name | "roles" |
| Primary key | [realmId+name] |

#### Properties of objects in "roles" table

```ts
interface Role {
  realmId: string;
  name: string;
  permissions: {
    add?: string[] | "*"; // array of tables or "*" (all).
    update?: {
      [tableName: string]: string[] | "*"; // array of properties or "*" (all).
    };
    manage?: string[] | "*"; // array of tables or "*" (all).
  };
}
```

_See [Permissions](#permissions)_

### Example: A Simple Project Management Model

In this example, we declare a very simplistic project database and use roles to distinguish permissions. We create our own roles "manager", "doer" and "commenter". The function `addProject()` will return a promise of adding a new project, `addMember()` adds a member to it, `addTask()` adds tasks to the project, `markAsDone()` marks a task as done and `addComment()` to add comments on tasks.

```js
import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

const db = new Dexie("myProjectDB", { addons: [dexieCloud] });
db.version(1).stores({
  projects: "@id, title",
  tasks: "@id, projectId, title, done",
  comments: "@id, taskId, comment",

  // Access Control
  realms: "@realmId",
  members: "[realmId+email]",
  roles: "[realmId+name]",
});

/** Add project.
 *
 * @param {string} projectName
 * @returns {Promise}
 *    Promise of string representing the ID of the added project.
 */
function addProject(projectName) {
  return db.transaction("rw", db.realms, db.roles, db.projects, async () => {
    // Create the new realm
    const newRealmId = await db.realms.add({
      // Add some custom optional props on the realm:
      name: `${projectName} realm`,
      description: `This realm controls access to the project ${projectName}`
    });

    // Add two roles for the project realm
    await db.roles.bulkAdd([
      {
        // Let managers create, update and delete all
        // objects and fields within the realm.
        name: "manager",
        realmId: newRealmId,
        permissions: { manage: "*" },
      },
      {
        // Let doers only update the "done" field in tasks
        name: "doer",
        realmId: newRealmId,
        permissions: {
          update: {
            tasks: [
              "done", // Allow update "done" property
            ],
          },
        },
      },
      {
        // Let commenters only add comments.
        // Since the added comments will have the owner property set to the
        // creator of the comment, the commenter will also be able to delete
        // or update own comments (but not others).
        name: "commenter",
        realmId: newRealmId,
        permissions: { add: ["comments"] },
      },
    ]);

    // Create project and put it in the new realm.
    return await db.projects.add({
      realmId: newRealmId,
      name: projectName,
    });
  });
}

/** Add project member.
 *
 * @param {Object} project The project object.
 * @param {string} email The email address of the member to add.
 * @param {string} name The name of the member to add.
 * @param {Array.<string>} roles Roles that the member should have.
 * @returns {Promise}
 */
function addMember(project, email, name, roles) {
  return db.members.add({
    realmId: project.realmId,
    email,
    name,
    roles,
    invite: true,
  });
}

/** Add project task.
 *
 * @param {Object} project The project object.
 * @param {string} taskTitle Task title.
 * @param {string} taskDescription Task description.
 * @param {Array.<string>} roles Member roles.
 * @returns {Promise}
 */
function addTask(project, taskTitle, taskDescription) {
  return db.tasks.add({
    projectId: project.id,
    realmId: project.realmId,
    title: taskTitle,
    done: 0,
    description: taskDescription,
  });
}

/** Mark task as done.
 *
 * @param {Object} task The task to update.
 */
function markAsDone(task) {
  return db.tasks.update(task.id, { done: Date.now() });
}

/** Add a comment to a task.
 *
 * @param {Object} task The task to comment.
 * @param {string} taskComment The comment to make.
 *
 * @returns {Promise}
 */
function addComment(task, taskComment) {
  return db.comments.add({
    taskId: task.id,
    realmId: task.realmId,
    comment: taskComment,
    timestamp: new Date(),
  });
}

/** Remove comment.
 *
 * @param commentId ID of comment to remove.
 * @returns {Promise}
 */
function removeComment(commentId) {
  return db.comments.delete(commentId);
}

/** Update comment
 *
 * @param commentId ID of comment to update.
 * @param newComment Updated text of the comment.
 * @returns {Promise}
 */
function updateComment(commentId, newComment) {
  return db.comments.update(commentId, {
    comment: newComment,
    timestamp: new Date(),
  });
}
```

## The Public Realm

As mentioned before, realms can be created any time, but there are also one "built-in" realm per user, representing the user's private data. Those realms have the same ID as the user's email address. There is also another built-in realm with the id "rlm-public". All users, also unauthenicated users, have visibility / sync access to it. By default, only the owner of the database has permissions to mutate data in the public realm but everyone have access to see and access its data online or offline.

Public data can either be populated using the REST API or using Dexie.js after having logged in as a user with the right permissions for that, such as the user who created the database - that user is automatically listed as a member in the public realm with full permissions. To add more users that should have access to publish public content, the original member has the permision to add more members to that realm and give fine grained permissions on what type of data the user can add or what fields the user can update.

The public realm can be specifically useful when you have structured public data such as a product catalog, list of locatio etc that should be available offline and indexed by IndexedDB.

Public realm is also useful in the zero-auth use case - when your app can be used without logging in to Dexie Cloud.
