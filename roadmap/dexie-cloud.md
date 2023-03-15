---
layout: docs
title: 'Road Map: Dexie Cloud'
---

Dexie Cloud is out in private beta since June 2021. This page contains the road map towards public release. This is a living document. See Milestones below. Features and dates may continously change.

[Dexie Cloud](https://dexie.org/cloud/)

# Milestone 1 - Private beta

The private beta was released in June 2021 and included the following features.

- [X] Initial documentation on dexie.org
- [X] CLI: "npx dexie-cloud create"
- [X] dexie-cloud-addon
- [X] Dexie Cloud Server published on https://dexie.cloud
- [X] Dexie Cloud CLI
- [X] Complete authentication flow using email OTP
- [X] Complete Sync flow
- [X] DB management access control
- [X] Token endpoint for custom authentication
- [X] Service Worker with periodic sync
- [X] A workind sample app

# Milestone 2 - Consistent Sync

This milestone was finalized in September 2021

- [X] ACID atomicity in sync requests
- [X] Full consistency when syncing Collection.modify() and Collection.delete() operations.
- [X] Respect CORS origins
- [X] Fully implemented CLI tool
- [X] Improved performance in WebSocket reactivity
- [X] Bug fixes

# Milestone 3 - Fully functional Access Control

This milestone was released December 19, 2021.

**Another 150 people from the wait list are now able to use it (update on december 21).**

- [x] Possible to create realms and respect permissions on sync and maintain realm consistency.
- [x] Support compound primary keys
- [x] New React hook `usePermission()` to disable unpermitted fields and buttons.
- [x] New permissions helper for non-react apps (db.cloud.permissions(db, table, obj), `can.add('members'), can.update('done'), can.delete()`)
- [x] Improve migration framework (server side on dexie cloud)
- [x] Add new migration to reflect updated model
- [x] Decide solution for binding an object to a dedicated realm
- [x] Support switching object between being shared (connected to realm) and private (connected to private realm) back and forth in a consistent manner.
- [x] Implement invite route on dexie cloud server (endpoint for accepting / rejecting invites)
- [x] Send out email invites when inviting people to a realm
- [x] Add demo users to sample app
- [x] Implement todo-list sharing on sample app
- [x] Support for private IDs (solution for per-user singletons)
- [x] Support for generating tied realm IDs (consistency of realms that are tied to an entity)
- [x] db.cloud.invites - an observable of invites
- [x] Tests
- [x] Run migration on production cloud and publish new version
- [x] Publish new version of sample todo app
- [x] Allowed another 150 people from the wait list!

# Milestone 4 - Role support + Updated Documentation

Target release date: ~~Jan 10, 2022.~~ May 31, 2022.

- [x] Respect global roles
- [x] Allow importing global roles in JSON format for dexie-cloud import CLI.
- [x] Add sharing support with roles to the sample app
- [x] Update Authentication docs: signed refresh tokens
- [x] Updated docs explaining that '@' keys are optional.
- [x] Docs: Explain Universally consistent modify() operations
- [x] Document all options in db.cloud.configure() 
- [x] Document db.cloud properties and how to use them
- [x] Document service worker support
- [x] Update docs for unauthorized use case
- [ ] ~~Document REST API: import / export~~
- [x] Document how to tie an object to a Realm

# Milestone 5 - Increase number of beta testers

- [x] Set up monitoring, alarms and redundancy
- [x] Approve more testers
- [x] Start sending out waitlist confirmation emails
- [x] Collect new requirements
- [x] New REST API
- [x] Document REST API

# Milestone 6 - Commercialization (CURRENT)

- [ ] Subscription manager
- [ ] Stripe Integration
- [ ] Implement monthly cost limit setting
- [ ] Implement end-user trial period for customer apps

