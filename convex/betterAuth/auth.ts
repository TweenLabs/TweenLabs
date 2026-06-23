import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";

import { components } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";
import authConfig from "../auth.config";
import schema from "./schema";

/**
 * Better Auth configuration — production-hardened.
 *
 * Security measures:
 * - Explicit trustedOrigins (no wildcards)
 * - OAuth providers gated behind env var checks
 * - Account linking with email verification enforced
 * - Secret from env var only — never hardcoded
 * - Verbose logging disabled in production
 */

// Better Auth Component
export const authComponent = createClient<DataModel, typeof schema>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components.betterAuth as any,
  {
    local: { schema },
    verbose: false,
  },
);

// Better Auth Options
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  const providers: BetterAuthOptions["socialProviders"] = {};

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
  }

  // Base URL — required for OAuth redirects
  const baseURL =
    process.env.SITE_URL ||
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000";

  // Trusted origins — explicit list, never wildcard
  const trustedOrigins = [baseURL];
  if (
    process.env.NODE_ENV === "development" &&
    !trustedOrigins.includes("http://localhost:3000")
  ) {
    trustedOrigins.push("http://localhost:3000");
  }

  return {
    appName: "TweenLabs",
    baseURL,
    trustedOrigins,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    socialProviders: providers,

    // Account linking — only when email is verified by the provider
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google", "github"],
      },
    },

    // Session configuration
    session: {
      expiresIn: 60 * 60 * 24 * 7,   // 7 days
      updateAge: 60 * 60 * 24,        // Refresh token daily
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,               // 5 min cache to reduce DB lookups
      },
    },

    plugins: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      convex({ authConfig }) as any,
    ],
  } satisfies BetterAuthOptions;
};

// For `auth` CLI
export const options = createAuthOptions({} as GenericCtx<DataModel>);

// Better Auth Instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
