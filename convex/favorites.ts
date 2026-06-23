import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * User Favorites — toggle, list, and check favorited components.
 *
 * Design:
 * - Auth-first: every function validates identity before any DB access
 * - Compound index (userId+componentName) for O(1) existence checks
 * - Per-user cap (500) enforced server-side to prevent abuse
 * - All errors use ConvexError with typed payloads
 */

const MAX_COMPONENT_NAME_LENGTH = 64;
const MAX_FAVORITES_PER_USER = 500;

// ── Toggle a favorite (atomic add/remove) ───────────────────────
export const toggleFavorite = mutation({
  args: {
    componentName: v.string(),
  },
  returns: v.object({
    action: v.union(v.literal("added"), v.literal("removed")),
    componentName: v.string(),
  }),
  handler: async (ctx, args) => {
    // Auth check — first operation, always
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "Sign in to favorite components.",
      });
    }

    const userId = identity.subject;
    const componentName = args.componentName.slice(
      0,
      MAX_COMPONENT_NAME_LENGTH,
    );

    // O(1) existence check via compound index
    const existing = await ctx.db
      .query("userFavorites")
      .withIndex("by_userId_componentName", (q) =>
        q.eq("userId", userId).eq("componentName", componentName),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { action: "removed" as const, componentName };
    }

    // Enforce per-user cap before insert
    const currentCount = await ctx.db
      .query("userFavorites")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(MAX_FAVORITES_PER_USER + 1);

    if (currentCount.length >= MAX_FAVORITES_PER_USER) {
      throw new ConvexError({
        code: "LIMIT_EXCEEDED",
        message: `Maximum of ${MAX_FAVORITES_PER_USER} favorites reached.`,
      });
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
  returns: v.array(
    v.object({ componentName: v.string(), addedAt: v.number() }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;

    const favorites = await ctx.db
      .query("userFavorites")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
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
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const userId = identity.subject;
    const componentName = args.componentName.slice(
      0,
      MAX_COMPONENT_NAME_LENGTH,
    );

    // O(1) lookup via compound index
    const existing = await ctx.db
      .query("userFavorites")
      .withIndex("by_userId_componentName", (q) =>
        q.eq("userId", userId).eq("componentName", componentName),
      )
      .unique();

    return existing !== null;
  },
});
