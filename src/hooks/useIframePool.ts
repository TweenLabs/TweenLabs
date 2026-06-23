"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Global LRU iframe pool — limits concurrent iframes across all preview cards.
 *
 * Two request modes:
 * - force=true  (hover): always succeeds, evicts LRU if pool is full
 * - force=false (preload): only fills empty slots, fails silently if full
 *
 * This ensures the first N visible cards preload without evicting each other,
 * while hover always gets a slot by evicting the oldest cached iframe.
 */

const MAX_POOL_SIZE = 8;

interface PoolEntry {
  lastUsed: number;
}

// ── Module-level singleton ──
const pool = new Map<string, PoolEntry>();
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Request a slot in the pool.
 * @param force true = evict LRU if full (always succeeds). false = only fill empty slots.
 */
function requestSlot(name: string, force: boolean): void {
  const existing = pool.get(name);
  if (existing) {
    // Already in pool — touch timestamp
    existing.lastUsed = Date.now();
    emitChange();
    return;
  }

  // Pool has capacity — grant immediately
  if (pool.size < MAX_POOL_SIZE) {
    pool.set(name, { lastUsed: Date.now() });
    emitChange();
    return;
  }

  // Pool full — non-evicting preload fails silently
  if (!force) return;

  // Evict LRU for forced (hover) requests
  let oldestKey: string | null = null;
  let oldestTime = Infinity;
  for (const [key, entry] of pool) {
    if (entry.lastUsed < oldestTime) {
      oldestTime = entry.lastUsed;
      oldestKey = key;
    }
  }
  if (oldestKey) {
    pool.delete(oldestKey);
    pool.set(name, { lastUsed: Date.now() });
    emitChange();
  }
}

/** Release a slot (component no longer needs its iframe). */
function releaseSlot(name: string): void {
  if (pool.delete(name)) {
    emitChange();
  }
}

/**
 * Hook — returns reactive slot status and request/release functions.
 * Re-renders only when THIS component's slot status changes.
 */
export function useIframePool(componentName: string) {
  const hasSlot = useSyncExternalStore(
    subscribe,
    () => pool.has(componentName),
    () => false, // Server snapshot
  );

  const request = useCallback(
    (force = true) => requestSlot(componentName, force),
    [componentName],
  );
  const release = useCallback(
    () => releaseSlot(componentName),
    [componentName],
  );

  return { hasSlot, requestSlot: request, releaseSlot: release };
}
