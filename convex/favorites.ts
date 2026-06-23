import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * User Favorites — toggle, list, and check favorited components.
 *
 * Production hardening:
 * - Input validation: componentName capped at 64 chars
 * - getUserFavorites: bounded with .take(500) to prevent runaway queries
 * - All queries use indexed scans for O(1) lookup
 * - Auth checks return graceful responses (empty array / false) for unauthenticated users
 */

const MAX_COMPONENT_NAME_LENGTH = 64;
const MAX_FAVORITES_PER_USER = 500;

// ── Toggle a favorite (add if missing, remove if exists) ────────
export const toggleFavorite = mutation({
  args: {
    componentName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be signed in to favorite components.");
    }

    const userId = identity.subject;
    const componentName = args.componentName.slice(0, MAX_COMPONENT_NAME_LENGTH);

    // Check if already favorited
    const existing = await ctx.db
      .query("userFavorites")
      .withIndex("userId_componentName", (q) =>
        q.eq("userId", userId).eq("componentName", componentName),
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { action: "removed" as const, componentName };
    }

    // Enforce per-user favorite limit
    const currentCount = await ctx.db
      .query("userFavorites")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .take(MAX_FAVORITES_PER_USER + 1);

    if (currentCount.length >= MAX_FAVORITES_PER_USER) {
      throw new Error(
        `Maximum of ${MAX_FAVORITES_PER_USER} favorites reached. Remove some before adding more.`,
      );
    }

    await ctx.db.insert("userFavorites", {
      userId,
      componentName,
      addedAt: Date.now(),
    });

    return { action: "added" as const, componentName };
  },
});

// ── Get all favorites for the current user ──────────────────────
export const getUserFavorites = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;

    const favorites = await ctx.db
      .query("userFavorites")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .take(MAX_FAVORITES_PER_USER);

    return favorites.map((f) => ({
      componentName: f.componentName,
      addedAt: f.addedAt,
    }));
  },
});

// ── Check if a specific component is favorited ──────────────────
export const isFavorited = query({
  args: {
    componentName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const userId = identity.subject;
    const componentName = args.componentName.slice(0, MAX_COMPONENT_NAME_LENGTH);

    const existing = await ctx.db
      .query("userFavorites")
      .withIndex("userId_componentName", (q) =>
        q.eq("userId", userId).eq("componentName", componentName),
      )
      .first();

    return !!existing;
  },
});
