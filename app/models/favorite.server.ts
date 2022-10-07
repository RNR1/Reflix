import arc from "@architect/functions";

import type { Profile } from "./profile.server";

export type Favorite = {
  id: number;
  profile: Profile["username"];
  properties?: object;
};

// TODO: fetch Movies database for movie by Id
export async function getFavorite({ id, profile }: Favorite): Promise<object> {
  return {};
}

// TODO: fetch Movies database for movies list
export async function getFavoriteListItems({
  profile,
}: Pick<Favorite, "profile">): Promise<Array<object>> {
  const db = await arc.tables();

  const result = await db.favorite.query({
    KeyConditionExpression: "profile = :profile",
    ExpressionAttributeValues: { ":profile": profile },
  });

  return result.Items;
}

export async function createFavorite({
  profile,
  id,
}: Pick<Favorite, "profile" | "id">): Promise<Favorite> {
  const db = await arc.tables();

  const result = await db.favorite.put({
    id,
    profile,
  });
  return {
    id: result.id,
    profile: result.profile,
  };
}

export async function deleteProfile({
  id,
  profile,
}: Pick<Favorite, "id" | "profile">) {
  const db = await arc.tables();
  return db.favorite.delete({ id, profile });
}
