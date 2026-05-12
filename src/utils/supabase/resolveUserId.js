/**
 * Resolves the current Supabase user for the browser client (getUser + getSession fallback).
 * `getUser()` alone can briefly return null on hydration; checkout/forms should use this.
 */
export async function resolveSupabaseBrowserUser(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return user;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

/**
 * Resolves the current Supabase auth user id for the browser client.
 */
export async function resolveSupabaseUserId(supabase) {
  const user = await resolveSupabaseBrowserUser(supabase);
  return user?.id ?? null;
}
