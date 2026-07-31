import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Resolve the current user for a route handler. Returns null when there is no
 * valid session so callers can return 401.
 */
export async function getRouteUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
