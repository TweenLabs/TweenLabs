import { type NextRequest, NextResponse } from "next/server";

/**
 * Edge proxy layer — request gate, traffic shaping & route protection.
 *
 * Next.js 16 uses `proxy.ts` instead of `middleware.ts`.
 * This file handles:
 *   1. Rate limiting (sliding-window per IP)
 *   2. Auth protection for /code/* pages and /api/registry/* API routes
 *   3. Rate limit response headers on all applicable routes
 */

// ── Rate-limit ledger ───────────────────────────────────────────
const _proxyLedger = new Map<string, { v: number; exp: number }>();

let _lastSweep = Date.now();
const _SWEEP_CYCLE = 60_000;

function _sweep() {
  const t = Date.now();
  if (t - _lastSweep < _SWEEP_CYCLE) return;
  _lastSweep = t;
  for (const [k, e] of _proxyLedger) {
    if (t > e.exp) _proxyLedger.delete(k);
  }
}

function _gate(
  sig: string,
  scope: string,
  ceil: number,
  ttl: number,
): { blocked: boolean; wait: number; count: number; ceil: number; exp: number } {
  _sweep();

  const k = `${sig}:${scope}`;
  const t = Date.now();
  const rec = _proxyLedger.get(k);

  if (!rec || t > rec.exp) {
    const exp = t + ttl;
    _proxyLedger.set(k, { v: 1, exp });
    return { blocked: false, wait: 0, count: 1, ceil, exp };
  }

  rec.v++;

  if (rec.v > ceil) {
    return { blocked: true, wait: rec.exp - t, count: rec.v, ceil, exp: rec.exp };
  }

  return { blocked: false, wait: 0, count: rec.v, ceil, exp: rec.exp };
}

// ── Rate-limit policies ─────────────────────────────────────────
const _POLICY = {
  auth: { ceil: 10, ttl: 60_000 },      // 10 req/min — brute-force protection
  registry: { ceil: 60, ttl: 60_000 },   // 60 req/min
  preview: { ceil: 30, ttl: 60_000 },    // 30 req/min
  api: { ceil: 60, ttl: 60_000 },        // 60 req/min — general API
} as const;

// ── Protected route prefixes ────────────────────────────────────
const PROTECTED_PAGE_PREFIXES = ["/code/"];
const PROTECTED_API_PREFIXES = ["/api/registry/"];

// ── Auth helpers ────────────────────────────────────────────────
/**
 * Better Auth stores the session token in a cookie named
 * `better-auth.session_token`. In production with HTTPS it may
 * also be `__Secure-better-auth.session_token`.
 */
function _hasSessionCookie(request: NextRequest): boolean {
  return (
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token")
  );
}

function _getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "0"
  );
}

/**
 * Attach rate-limit headers to a response.
 */
function _withRateLimitHeaders(
  response: NextResponse,
  count: number,
  ceil: number,
  exp: number,
): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(ceil));
  response.headers.set("X-RateLimit-Remaining", String(Math.max(0, ceil - count)));
  response.headers.set("X-RateLimit-Reset", String(exp));
  return response;
}

// ── Main proxy function ─────────────────────────────────────────
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sig = _getClientIp(request);

  // ── 1. Auth: Protected pages (redirect unauthenticated users) ──
  if (PROTECTED_PAGE_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!_hasSessionCookie(request)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/components";
      redirectUrl.searchParams.set("login", "true");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // ── 2. Auth: Protected API routes (return 401) ────────────────
  if (PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    const userAgent = request.headers.get("user-agent") || "";
    // Allow CLI requests through
    if (!userAgent.includes("tweenlabs-cli") && !_hasSessionCookie(request)) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to access this resource." },
        { status: 401 },
      );
    }
  }

  // ── 3. Rate limiting ──────────────────────────────────────────
  let gateResult: ReturnType<typeof _gate> | null = null;

  if (pathname.startsWith("/api/auth")) {
    gateResult = _gate(sig, "a", _POLICY.auth.ceil, _POLICY.auth.ttl);
  } else if (pathname.startsWith("/api/registry")) {
    gateResult = _gate(sig, "r", _POLICY.registry.ceil, _POLICY.registry.ttl);
  } else if (pathname.startsWith("/api/")) {
    gateResult = _gate(sig, "g", _POLICY.api.ceil, _POLICY.api.ttl);
  } else if (pathname.startsWith("/preview/")) {
    gateResult = _gate(sig, "p", _POLICY.preview.ceil, _POLICY.preview.ttl);
  }

  // Block if rate limit exceeded
  if (gateResult?.blocked) {
    const retryAfter = Math.ceil(gateResult.wait / 1000);
    return _withRateLimitHeaders(
      new NextResponse(
        JSON.stringify({
          error: "Too many requests. Please slow down.",
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
          },
        },
      ) as NextResponse,
      gateResult.count,
      gateResult.ceil,
      gateResult.exp,
    );
  }

  // ── Pass through with rate-limit headers ──────────────────────
  const response = NextResponse.next();

  if (gateResult) {
    _withRateLimitHeaders(response, gateResult.count, gateResult.ceil, gateResult.exp);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets:
     * - _next/static, _next/image
     * - favicon.ico, sitemap.xml, robots.txt
     * - Image/font files
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)).*)",
  ],
};
