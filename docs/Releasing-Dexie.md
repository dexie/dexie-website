---
layout: docs
title: 'Releasing Dexie'
---

TL;DR

Only for lead contributors with access to publish on npm.

## Preparation

* Have a dedicated master clone on your hard drive, for example `/c/repos/dexie-release`

## Release Procedure

### Before Releasing

1. Have a dedicated 'dexie-release' clone of master

```bash
cd /c/repos/dexie-release # or dexie-release-1 for maintainance releases o 1.x.
git status # Make sure your working directory is clean
git checkout master # Or master-1 for maintainance release of 1.x.
git pull # Pull latest
git status # Make sure your working directory is still clean.
npm install # Makes sure to install added deps
```

2. Are you releasing addons together with dexie? If so, make sure to bump addons versions in their package.json and commit that before proceeding. The release script will release the addons if their version differs from their released version on npm.

3. Make sure to have BROWSER_STACK_USERNAME and BROWSER_STACK_ACCESS_KEY environment variables set! Otherwise the full test suite will be unable to run.

4. Make sure that BrowserStack Tunnel is KILLED on your system. To kill it, run BrowserstackLocal app on your machine and click Kill Tunnel.

### Releasing

1. CD to your dedicated 'dexie-release' location.

```bash
tools/release.sh
# enter new version number. If prerelase, use a pre-release version
# such as "2.0.0-beta.10"
# If addons have version bumps, you will be asked whether to release
# them as well.
```

Tests will run via karma. It will test the full suite on browserstack.
Script will publish on npm and checkin dist builded files into github/releases branch.

2. Browse to https://github.com/dfahlander/Dexie.js/releases and edit the new tag so that it becomes a release. Write release notes based on the commit history.

### If release.sh fails...

```
git reset --hard origin/master
```

Then, fix problems and re-run tools/release.sh

*NOTE: IE and Edge have some general indexedDB instability that periodically makes arbritary tests timeout or fail. When this happens, you might need to re-run the whole procedure again.*
