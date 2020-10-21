---
layout: docs-dexie-cloud
title: 'Access Control'
---

The server endpoint of Dexie Cloud controls access to data for every sync request, so that each user can maintain a copy of the part of the database that is accessible for that user.

This page describes the access control model in Dexie Cloud. If you prefer to jump right in to samples, here some shortcuts:

* [Share a ToDo list](#example-share-a-todo-list)
* [Simple project managment model](#example-a-simple-project-management-model)

## Realms

A realm is an access controlled bucket of data. All objects in your database sits on a realm. By default, it sits on the private realm for the user that creates the object. Realms can be created by anyone. Users with manage permissions on the realm can create roles and invite members to the realm.

## Reserved property names

In all custom application tables, there are two reserved property names that affect access control:

* realmId - connects the object to a realm, making it visible (synced) for the members in the realm. If realmId is not specified, the current user's email will be used, which is a built-in realm that each user has. However, there are no realm objects representing these built-in realms.
* owner - connects the object to a user that gains full permissions on it. Ownership implies access to update and delete the object including changing realmId and owner properties, but it does not imply visibility (sync). If a member is removed from a realm, objects connected to that realm that are owned by the user will go out of scope for the user. If owner is not specified, it will default to the current user. If explicitely set to null, it will not have an owner.

## Default Access Control

In the simplest setup of Dexie Cloud, you do not need to specify anything related to access control. All data that one user creates will be private. It will sync to the cloud but not visible for any other user. This is still a valid use case since the data is continously backed up and possible to access from different devices for the same user.

#### Example: not specifying access control tables
```js
import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

const db = new Dexie('mySyncedDB', {addons: [dexieCloud]});
db.version(1).stores({
  todoLists: 'id, title',
  todoItems: 'id, title, done, todoListId'
});
```
*In this sample, we are only declaring application tables 'todoLists' and 'todoItems'. This is ok. Sync will work for each user, but users will not be able to share their lists with others*

## Access Control Tables

Access control is defined using the Dexie tables [realms](#table-realms), [members](#table-members) and [roles](#table-roles). To take advantage of these, just add them to your schema declaration. The server end-point will know how to handle these special tables if they are present.

```js
import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

const db = new Dexie('myDB', {addons: [dexieCloud]});
db.version(2).stores({
  // Application tables
  todoLists: 'id, title',
  todoItems: 'id, title, done, todoListId',

  // Access Control tables
  realms: 'realmId',
  members: '[realmId+email]',
  roles: '[realmId+name]'
});
```
*Access Control tables needs to be spelled exactly as in this sample and their primary keys needs to be spelled exactly the same. On top of that, you are free to index those properties you will need to query. The properties of objects in these tables are documented under each table below.*

We will walk through how to use these tables to share objects to others.

### Table "realms"

Access Control are defined using realms. Each object you create belongs to a realm even if realm is not specified. Every user has its own private realm. Users can create new realms and invite other users to them. The id of a realm needs to be a globally unique string.

| Table Name | "realms" |
| Primary key | realmId |

By default, when adding objects to a table, it will implicitly get a "realmId" property pointing out the private realm of the current user. To make an object belong to a custom realm, just set the "realmId" property to the ID of the created realm.

You normal reuse the same realm for multiple objects to easily share all included objects atomically by adding members to your realm. Each member within a realm can also be given different permissions. Permissions can optionally be organized via roles.

#### Properties of objects in "realms" table

```ts
interface Realm {
  realmId: string;
  name: string;
  owner?: string;
}
```

#### Example: Share a ToDo list

This example shows how to share a ToDo list with a friend by creating a realm, share it and moving the existing TodoList and TodoItems into that realm.

```js
await db.transaction('rw', db.todoLists, db.todoItems, db.realms, db.members, async () => {
  // Generate a globally unique ID for the realm to create
  const newRealmId = db.realms.newId();

  // Create the new realm
  await db.realms.add({
    realmId: newRealmId,
    name: "Shopping list realm"
  });

  // Move an existing todo-list into this new realm
  await db.todoLists.update(shoppingTodoListId, {realmId: newRealmId});
  await db.todoItems
    .where({todoListId: myTodoListId})
    .modify({realmId: newRealmId});

  // Invite yourself and a friend
  await db.members.bulkAdd([{
    realmId: newRealmId,
    email: db.cloud.currentUser.email,
    name: "My own Name",
    permissions: {
      manage: "*"
    }
    // invite never needed for oneself
  },{
    realmId: newRealmId,
    email: "myfriend@foo.bar",
    name: "My Friend",
    invite: true, // Generates an invite email from dexie cloud
    permissions: {
      manage: "*"
    }
  }]);
});
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
  name: string;
  invite?: boolean;
  invited?: number; // date
  accepted?: number; // date
  roles?: string[];
  permissions?: {
    add?: string[] | "*";    // array of tables or "*" (all).
    update?: {
      [tableName: string]: string[] | "*" // array of properties or "*" (all).
    };
    manage?: string[] | "*"; // array of tables or "*" (all).
  }
}
```

#### Permissions

__add__

Permission to add new objects to given set of tables. If a creator of an object may specify the "owner" property on to own email, the user will keep full permission on the object and be able to delete or update the object later on. If not specifying the "owner" property, the object gets out of ones hand after the creation is done.

__update__

Permission to update given set of properties in given set of tables. Allowing "*" will still not allow updating reserved properties `realmId` or `owner`. For example, if you have "update" permission on the "pets" table, you can change the pet's name but not its "owner" or "realmId".

__manage__

Full permissions on objects within the realm in given set of tables.

#### Default Membership flow

This is the typical flow for the non-enterprise use case in applications with a similar model as Slack, Github and ToDo list applications.

1. Add new object to the 'members' table with {invite: true}.
2. Email goes out to the invited user.
3. User clicks link in email to accept the invitation.
4. User gains access
5. Next sync request from a device belonging to the user will start downloading data connected to the newly accepted realm.

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
    add?: string[] | "*";    // array of tables or "*" (all).
    update?: {
      [tableName: string]: string[] | "*" // array of properties or "*" (all).
    };
    manage?: string[] | "*"; // array of tables or "*" (all).
  }
}
```

*See [Permissions](#permissions)*

### Example: A Simple Project Management Model

In this example, we declare a very simplistic project database and use roles to distinguish permissions. We create our own roles "manager", "doer" and "commenter". The function `addProject()` will return a promise of adding a new project, `addMember()` adds a member to it, `addTask()` adds tasks to the project, `markAsDone()` marks a task as done and `addComment()` to add comments on tasks.

```js

import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

const db = new Dexie('myProjectDB', {addons: [dexieCloud]});
db.version(1).stores({
  projects: 'id, title',
  tasks: 'id, projectId, title, done',
  comments: 'id, taskId, comment',

  // Access Control
  realms: 'realmId',
  members: '[realmId+email]',
  roles: '[realmId+name]'
});

/** Add project.
 * 
 * @param {string} projectName
 * @returns {Promise} Promise of string representing the ID of the added project.
 */
function addProject(projectName) {
  return db.transaction('rw', db.realms, db.roles, db.projects, () => {
    // Generate a globally unique ID for the realm to create
    const newRealmId = db.realms.newId();
    const newProjectId = db.projects.newId();

    // Create the new realm
    db.realms.add({
      realmId: newRealmId,
      name: projectName
    });

    // Add two roles for the project realm
    db.roles.bulkAdd([{
      // Let managers create, update and delete all objects and fields within the realm.
      name: "manager",
      realmId: newRealmId,
      permissions: {manage: "*"}
    },{
      // Let doers only update the "done" field in todoItems
      name: "doer",
      realmId: newRealmId,
      permissions: {
        update: {
          todoItems: [
            "done" // Allow updating "done" property of todoItems connected to this realm.
          ]
        }
      }
    }, {
      // Let commenters only add comments
      // Since the added comments will be owned by the user, a commenter will also
      // be able to delete or update own comments but not others.
      name: "commenter",
      realmId: newRealmId,
      permissions: { add: ["comments"] }
    }]);

    // Create project and put it in the new realm.
    db.projects.add({
      id: newProjectId,
      realmId: newRealmId,
      name: projectName
    });

    return newProjectId;
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
    invite: true
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
    id: db.tasks.newId(),
    projectId: project.id,
    realmId: project.realmId,
    title: taskTitle,
    done: 0,
    description: taskDescription
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
    id: db.comments.newId(),
    taskId: task.id,
    realmId: task.realmId,
    comment: taskComment,
    timeStamp: Date.now()
  });
}

```
