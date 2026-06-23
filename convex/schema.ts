import { defineSchema } from "convex/server";
import { tables as betterAuthTables } from "./betterAuth/schema";
import { tables as appTables } from "./appSchema";

export default defineSchema({
  ...betterAuthTables,
  ...appTables,
});
