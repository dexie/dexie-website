---
layout: docs
title: 'Releasing Dexie'
---

TL;DR

Only for lead contributors with access to publish on npm.

## Preparation

* Have a dedicated master clone on your hard drive, for example `/c/repos/dexie-release`
* Have nescessary npm packages installed globally (if any?... FIXTHIS)

## Release Procedure

Before releasing:

1. Check if you have anything to push from develop to master. If so,
  
* First run unit tests if uncertain, then,
* commit any changes to local develop branch, then:

```bash
git push origin develop
```

Then, create pull request on [https://github.com/dfahlander/Dexie.js/tree/develop](https://github.com/dfahlander/Dexie.js/tree/develop), confirm and merge it.

1. CD to your development clone of the develop branch and update from master.

```bash
git checkout develop
git merge master develop
```

2. Run unit tests in IE (or Edge), chrome (or opera) and firefox. TODO: Automate this throw browserstack.
3. Run the unit test addons/Dexie.Observable/test/test-observable-dexie-tests.html in chrome at least. One test fails and explains why. TODO: Make the test succeed and make sure to automate this as well.

Releasing:

4. CD to your dedicated 'dexie-release' location.

```bash
git checkout master
git pull
git status      # should be clean
tools/release.sh
# enter new version number. If prerelase, use a pre-release version
# such as "1.3.5-beta"
```

Tests will run via karma.
Script will publish on npm and checkin dist builded files into github/releases branch.

5. Browse to https://github.com/dfahlander/Dexie.js/releases and edit the new tag so that it becomes a release. Write release notes based on the commit history.

### If release.sh fails...

```
git reset --hard origin/master
```

Then, fix problems and re-run tools/release.sh
