---
layout: docs-dexie-cloud
title: "SyncState"
---

```ts

export interface SyncState {
  status: SyncStatus;
  phase: SyncStatePhase;
  progress?: number; // 0..100
  error?: Error; // If phase === "error"
}

export type SyncStatus =
  | "not-started"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error"
  | "offline";

export type SyncStatePhase =
  | "initial"
  | "not-in-sync"
  | "pushing"
  | "pulling"
  | "in-sync"
  | "error"
  | "offline";

```
