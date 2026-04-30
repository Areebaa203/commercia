/**
 * Canonical site origin for Supabase Auth `redirectTo` / `emailRedirectTo`.
 *
 * Priority: NEXT_PUBLIC_SITE_URL → NEXT_PUBLIC_VERCEL_URL → request URL origin (server)
 * → window.location.origin (client) → http://localhost:3000.
 *
 * @param {Request} [request] - For Route Handlers without public env (e.g. local API): uses `request.url` origin.
 * @see https://supabase.com/docs/guides/auth/redirect-urls
 */
export function getSiteUrl(request) {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL ?? null;

  if (url) {
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    return url.replace(/\/+$/, "");
  }

  if (request) {
    return new URL(request.url).origin;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "http://localhost:3000";
}

/**
 * @param {string} pathWithSearch - e.g. `/auth/callback?next=/dashboard`
 * @param {Request} [request] - Pass from Route Handlers when env is unset so links match the caller origin.
 */
export function authRedirectUrl(pathWithSearch, request) {
  const base = getSiteUrl(request);
  const path = pathWithSearch.startsWith("/") ? pathWithSearch : `/${pathWithSearch}`;
  return `${base}${path}`;
}
