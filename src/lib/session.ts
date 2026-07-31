import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Get the current session server-side, or null if not logged in. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Require a logged-in user; redirect to /login otherwise. Returns the user. */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}
