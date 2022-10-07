import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { createProfile } from "~/models/profile.server";
import { createUserSession } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 test routes should not be enabled in production 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨"
    );
    // test routes should not be enabled in production or without
    // enable test routes... Just in case this somehow slips through
    // we'll redirect :)
    return redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  }

  const { username } = await request.json();
  if (!username) {
    throw new Error("name required for login");
  }

  const profile = await createProfile(username, "https://example.com");

  return createUserSession({
    request,
    profileName: profile.username,
    remember: true,
    redirectTo: "/",
  });
};

export default null;
