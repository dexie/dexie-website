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

# Milestone 3 - Fully functional Access Control (CURRENT)

This milestone is planned to be released on November 30.

- [X] Possible to create realms and respect permissions on sync and maintain realm consistency.
- [X] New React hook `usePermission()` to disable unpermitted fields and buttons.
- [X] Improve migration framework (server side on dexie cloud)
- [X] Add new migration to reflect updated model
- [X] Decide solution for binding an object to a dedicated realm
- [ ] Support switching object between being shared (connected to realm) and private (connected to private realm) back and forth in a consistent manner.
- [ ] Respect roles
- [ ] Respect global roles
- [ ] Allow importing global roles in JSON format for dexie-cloud import CLI.
- [ ] Add sharing support with roles to the sample app
- [ ] Implement invite route on dexie cloud server (endpoint for accepting / rejecting invites)
- [ ] Send out email invites when inviting people to a realm
- [ ] Add demo users to sample app
- [ ] Decide a solution for per-user singletons
- [ ] Implement solution for per-user singletons
- [ ] Run migration on production cloud and publish new version

# Milestone 4 - Update Documentation

- [ ] Update Authentication docs: signed refresh tokens
- [ ] Updated docs explaining that '@' keys are optional.
- [ ] Universally consistent modify() operations
- [ ] Document all options in db.cloud.configure() 
- [ ] Document service worker support
- [ ] Update docs for unauthorized use case
- [ ] Document REST API: import / export
- [ ] Document db.cloud properties and how to use them
- [ ] Document how to tie an object to a Realm

# Milestone 5 - Commercialization

- [ ] Subscription manager
- [ ] Stripe Integration
- [ ] Implement monthly cost limit setting
- [ ] Implement end-user trial period for customer apps
- [ ] Implement option to allow end-users purchase subscriptions from us
