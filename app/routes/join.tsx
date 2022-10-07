import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { getProfileName, createUserSession } from "~/session.server";

import { createProfile, getProfileByName } from "~/models/profile.server";
import { safeRedirect } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getProfileName(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    username?: string;
    avatar?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const avatar = formData.get("avatar");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (typeof username !== "string" || username?.trim().length < 1) {
    return json<ActionData>(
      { errors: { username: "Name is invalid" } },
      { status: 400 }
    );
  }

  const existingProfile = await getProfileByName(username);
  if (existingProfile) {
    return json<ActionData>(
      { errors: { username: "A profile already exists with this name" } },
      { status: 400 }
    );
  }

  const profile = await createProfile(username, avatar);

  return createUserSession({
    request,
    profileName: profile.username,
    remember: false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Create Profile",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const avatarRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.username) {
      usernameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                ref={usernameRef}
                id="username"
                required
                autoFocus={true}
                name="username"
                type="text"
                autoComplete="username"
                aria-invalid={actionData?.errors?.username ? true : undefined}
                aria-describedby="username-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.username && (
                <div className="pt-1 text-red-700" id="username-error">
                  {actionData.errors.username}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700"
            >
              Avatar
            </label>
            <div className="mt-1">
              <input
                id="avatar"
                ref={avatarRef}
                name="avatar"
                type="avatar"
                autoComplete="photo"
                aria-invalid={actionData?.errors?.avatar ? true : undefined}
                aria-describedby="avatar-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.avatar && (
                <div className="pt-1 text-red-700" id="avatar-error">
                  {actionData.errors.avatar}
                </div>
              )}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create Profile
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have a profile?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Go to Profiles
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
