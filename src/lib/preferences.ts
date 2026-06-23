/**
 * User preferences cookie utility.
 *
 * Stores lightweight user preferences in a `tl-prefs` cookie.
 * NOT httpOnly — needs to be readable by JS for instant theme
 * application on page load (prevents flash of wrong theme).
 *
 * Cookie format: JSON string, e.g. { "theme": "dark" }
 */

export interface UserPreferences {
  theme: "light" | "dark";
}

const COOKIE_NAME = "tl-prefs";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "light",
};

// ── Server-side: read from cookies() ────────────────────────────

/**
 * Parse preferences from a raw cookie string (server-side).
 * Returns defaults for any missing or invalid values.
 */
export function parsePreferences(cookieValue: string | undefined): UserPreferences {
  if (!cookieValue) return { ...DEFAULT_PREFERENCES };

  try {
    const parsed = JSON.parse(cookieValue);
    return {
      theme: parsed.theme === "dark" ? "dark" : "light",
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

// ── Client-side helpers ─────────────────────────────────────────

/**
 * Get current preferences from the cookie (client-side).
 */
export function getPreferences(): UserPreferences {
  if (typeof document === "undefined") return { ...DEFAULT_PREFERENCES };

  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`),
  );

  return parsePreferences(match ? decodeURIComponent(match[1]) : undefined);
}

/**
 * Set a single preference value.
 * Merges with existing preferences and writes back to cookie.
 */
export function setPreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K],
): void {
  if (typeof document === "undefined") return;

  const current = getPreferences();
  current[key] = value;

  const encoded = encodeURIComponent(JSON.stringify(current));
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";

  document.cookie = [
    `${COOKIE_NAME}=${encoded}`,
    `path=/`,
    `max-age=${MAX_AGE}`,
    `samesite=lax`,
    isSecure ? "secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  // Also update the data-theme attribute on <html> immediately
  if (key === "theme") {
    document.documentElement.setAttribute("data-theme", value as string);
  }
}

/**
 * Get all preferences as a plain object.
 */
export function getAllPreferences(): UserPreferences {
  return getPreferences();
}
