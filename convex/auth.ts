import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

/**
 * Auth queries — user lookup and profile management.
 *
 * Design:
 * - getCurrentUser: auth-gated, indexed lookup by ID then email fallback
 * - storeUser: input-validated, idempotent upsert
 * - All user IDs derived from ctx.auth — never from client
 */

// ── Get current authenticated user ──────────────────────────────
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Primary lookup: direct ID fetch — O(1)
    let user = await ctx.db.get(identity.subject as Id<"user">);

    // Fallback: email index lookup (handles edge cases during migration)
    if (!user && identity.email) {
      user = await ctx.db
        .query("user")
        .withIndex("email_name", (q) => q.eq("email", identity.email as string))
        .first();
    }

    if (!user) return null;

    return {
      ...user,
      pictureUrl: user.image || identity.pictureUrl,
    };
  },
});

// ── Store or update user profile ────────────────────────────────
export const storeUser = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Auth check first — always
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "Must be signed in to update profile.",
      });
    }

    // Input validation — enforce limits
    if (args.name && args.name.length > 100) {
      throw new ConvexError({
        code: "VALIDATION_ERROR",
        message: "Name must be 100 characters or less.",
      });
    }
    if (args.image && args.image.length > 2048) {
      throw new ConvexError({
        code: "VALIDATION_ERROR",
        message: "Image URL must be 2048 characters or less.",
      });
    }

    // Primary: direct ID fetch
    let userId = identity.subject as Id<"user">;
    let existingUser = await ctx.db.get(userId);

    // Fallback: email index
    if (!existingUser && identity.email) {
      existingUser = await ctx.db
        .query("user")
        .withIndex("email_name", (q) => q.eq("email", identity.email as string))
        .first();
      if (existingUser) {
        userId = existingUser._id;
      }
    }

    if (existingUser) {
      // Atomic update — only touched fields
      await ctx.db.patch(userId, {
        name: args.name ?? existingUser.name,
        image: args.image ?? existingUser.image,
        updatedAt: Date.now(),
      });
      return userId;
    }

    // New user insert
    const newUserId = await ctx.db.insert("user", {
      name: args.name ?? identity.name ?? "User",
      email: identity.email ?? "unknown",
      emailVerified: identity.emailVerified ?? true,
      image: args.image ?? identity.pictureUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return newUserId;
  },
});
