---
layout: docs-dexie-cloud
title: 'Authentication in Dexie Cloud'
---

This page describes how to customize authentication in Dexie Cloud.

If you are new to Dexie Cloud, please visit the [Dexie Cloud landing page](/cloud/).

If you prefer to jump right in to samples, here some shortcuts:

- TBD!
- TBD!

## Introduction

Dexie Cloud is for writing offline capable applications, which means that the typical use case is long-lived authentication sessions that lasts for days, weeks or until the user actively logs out from it. Dexie Cloud *can* be configured to be used without authentication for certain use cases, but to enable feature-rich and collaborative applications, authentication can be crucial.

In the default setup, users will only need to authenticate the very first time they visit your app. There is no registration step for your users and they won't need to create any password, as authentication is performed over passwordless email OTP. The authentication step will result in a securely stored, non-exportable crypto key in your indexedDB that can reathenticate future sync calls automatically without having to require further user interaction.

## Customize Authentication Prompts

Here we cover how you can customize authentication prompts to show whatever GUI you want when prompting your users for email address and OTP. It assumes you want to keep the default authentication solution and only adjust the GUI of it.

TBD!

## Use Custom Authentication

TBD!

## Use 3rd part Authentication

TBD!
