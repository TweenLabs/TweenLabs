import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

/**
 * Gets the current authenticated user from the database.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // better-auth uses the user's ID as the identity subject
    let user = await ctx.db.get(identity.subject as Id<"user">);
    if (!user && identity.email) {
      const email = identity.email as string;
      user = await ctx.db
        .query("user")
        .withIndex("email_name", (q) => q.eq("email", email))
        .first();
    }

    if (!user) {
      return null;
    }

    return {
      ...user,
      pictureUrl: user.image || identity.pictureUrl,
    };
  },
});

/**
 * Explicitly stores or updates user data in the Convex database.
 * Usually handled by better-auth, but useful for manual updates.
 */
export const storeUser = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication");
    }

    let userId = identity.subject as Id<"user">;
    let existingUser = await ctx.db.get(userId);
    if (!existingUser && identity.email) {
      const email = identity.email as string;
      existingUser = await ctx.db
        .query("user")
        .withIndex("email_name", (q) => q.eq("email", email))
        .first();
      if (existingUser) {
        userId = existingUser._id;
      }
    }

    if (existingUser) {
      await ctx.db.patch(userId, {
        name: args.name ?? existingUser.name,
        image: args.image ?? existingUser.image,
        updatedAt: Date.now(),
      });
      return userId;
    } else {
      const newUserId = await ctx.db.insert("user", {
        name: args.name ?? identity.name ?? "User",
        email: identity.email ?? "unknown",
        emailVerified: identity.emailVerified ?? true,
        image: args.image ?? identity.pictureUrl,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return newUserId;
    }
  },
});

/**
 * Checks if a user exists in the database by their email address.
 */
export const checkUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .withIndex("email_name", (q) => q.eq("email", args.email))
      .first();
    return !!user;
  },
});
