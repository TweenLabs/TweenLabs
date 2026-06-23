import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

/**
 * Maintenance — scheduled cleanup tasks (called via crons.ts).
 *
 * Design:
 * - Internal mutations only — not callable from clients
 * - Batched deletes (500) to stay within Convex transaction limits
 * - Uses indexed scans — no full-table scans
 * - Idempotent — safe to retry without side effects
 */

const BATCH_SIZE = 500;

// ── Clean expired sessions ──────────────────────────────────────
export const cleanExpiredSessions = internalMutation({
  args: {},
  returns: v.object({ deleted: v.number() }),
  handler: async (ctx) => {
    const now = Date.now();

    const expired = await ctx.db
      .query("session")
      .withIndex("expiresAt")
      .order("asc")
      .take(BATCH_SIZE);

    let deleted = 0;
    for (const session of expired) {
      if (session.expiresAt < now) {
        await ctx.db.delete(session._id);
        deleted++;
      } else {
        break; // Index is ordered — no more expired records after this
      }
    }

    return { deleted };
  },
});

// ── Clean old page views (older than 90 days) ───────────────────
export const cleanOldPageViews = internalMutation({
  args: {},
  returns: v.object({ deleted: v.number() }),
  handler: async (ctx) => {
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;

    const old = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp")
      .order("asc")
      .take(BATCH_SIZE);

    let deleted = 0;
    for (const view of old) {
      if (view.timestamp < ninetyDaysAgo) {
        await ctx.db.delete(view._id);
        deleted++;
      } else {
        break; // Index is ordered — stop at first non-expired record
      }
    }

    return { deleted };
  },
});
