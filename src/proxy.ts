import { type NextRequest, NextResponse } from "next/server";

/**
 * Edge proxy layer — request gate & traffic shaping.
 */
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
): { blocked: boolean; wait: number } {
  _sweep();

  const k = `${sig}:${scope}`;
  const t = Date.now();
  const rec = _proxyLedger.get(k);

  if (!rec || t > rec.exp) {
    _proxyLedger.set(k, { v: 1, exp: t + ttl });
    return { blocked: false, wait: 0 };
  }

  rec.v++;

  if (rec.v > ceil) {
    return { blocked: true, wait: rec.exp - t };
  }

  return { blocked: false, wait: 0 };
}

const _POLICY = {
  auth: { ceil: 20, ttl: 60_000 },
  registry: { ceil: 100, ttl: 60_000 },
} as const;

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const sig =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "0";

  let policy: (typeof _POLICY)[keyof typeof _POLICY];
  let scope: string;

  if (pathname.startsWith("/api/auth")) {
    policy = _POLICY.auth;
    scope = "a";
  } else if (pathname.startsWith("/api/registry")) {
    policy = _POLICY.registry;
    scope = "r";
  } else {
    return NextResponse.next();
  }

  const { blocked, wait } = _gate(sig, scope, policy.ceil, policy.ttl);

  if (blocked) {
    return NextResponse.json(
      { error: "Request denied." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(wait / 1000)) },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
