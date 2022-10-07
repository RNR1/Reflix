import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { Profile } from "~/models/profile.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

export function isProfile(profile: any): profile is Profile {
  return (
    profile &&
    typeof profile === "object" &&
    typeof profile.username === "string"
  );
}

export function useOptionalProfile(): Profile | undefined {
  const data = useMatchesData("root");
  if (!data || !isProfile(data.profile)) {
    return undefined;
  }
  return data.profile;
}

export function useProfile(): Profile {
  const maybeProfile = useOptionalProfile();
  if (!maybeProfile) {
    throw new Error(
      "No profile found in root loader, but profile is required by useProfile. If profile is optional, try useOptionalProfile instead."
    );
  }
  return maybeProfile;
}
