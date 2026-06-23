import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Clean expired sessions — daily at 3:00 AM UTC
crons.daily(
  "clean expired sessions",
  { hourUTC: 3, minuteUTC: 0 },
  internal.maintenance.cleanExpiredSessions,
);

// Clean old page views (90+ days) — weekly on Sunday at 4:00 AM UTC
crons.weekly(
  "clean old page views",
  { dayOfWeek: "sunday", hourUTC: 4, minuteUTC: 0 },
  internal.maintenance.cleanOldPageViews,
);

export default crons;
