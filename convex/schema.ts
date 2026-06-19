import { defineSchema } from "convex/server";
import { tables } from "./betterAuth/schema";

export default defineSchema({
  ...tables,
});
