import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { Profile } from "~/models/profile.server";
import { getProfileByName } from "~/models/profile.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "profileName";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getProfileName(
  request: Request
): Promise<Profile["username"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getProfile(request: Request) {
  const profileName = await getProfileName(request);
  if (profileName === undefined) return null;

  const profile = await getProfileByName(profileName);
  if (profile) return profile;

  throw await logout(request);
}

export async function requireProfileName(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const profileName = await getProfileName(request);
  if (!profileName) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return profileName;
}

export async function requireProfile(request: Request) {
  const profileName = await requireProfileName(request);

  const profile = await getProfileByName(profileName);
  if (profile) return profile;

  throw await logout(request);
}

export async function createUserSession({
  request,
  profileName,
  remember,
  redirectTo,
}: {
  request: Request;
  profileName: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, profileName);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
