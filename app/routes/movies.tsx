import { Form, Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import React from "react";
import { requireProfileName } from "~/session.server";
import { useProfile } from "~/utils";
import { getMovieListItems } from "~/models/movie.server";

type LoaderData = {
  movies: Awaited<ReturnType<typeof getMovieListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const profileName = await requireProfileName(request);
  if (!profileName) return redirect("/");
  return json({ movies: await getMovieListItems() });
};

export default function Movies() {
  const data = useLoaderData() as LoaderData;
  const profile = useProfile();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Movies</Link>
        </h1>
        <p>{profile.username}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          {data.movies.length === 0 ? (
            <p className="p-4">No movies yet</p>
          ) : (
            <></>
          )}
        </div>
      </main>
    </div>
  );
}
