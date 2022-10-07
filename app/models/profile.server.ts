import arc from "@architect/functions";
import invariant from "tiny-invariant";

export type Profile = { username: string; avatar: string | File | null };

export async function getProfileByName(
  name: Profile["username"]
): Promise<Profile | null> {
  const db = await arc.tables();
  const result = await db.profile.query({
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: { ":username": name },
  });

  const [record] = result.Items;

  if (record) return { username: record.username, avatar: record.avatar };
  return null;
}

export async function createProfile(
  username: Profile["username"],
  avatar: Profile["avatar"]
) {
  const db = await arc.tables();

  await db.profile.put({
    username,
    avatar,
  });

  const user = await getProfileByName(username);
  invariant(
    user,
    `Profile not found after being created. This should not happen`
  );

  return user;
}

export async function deleteProfile(name: Profile["username"]) {
  const db = await arc.tables();
  await db.profile.delete({ name });
}

export async function verifyLogin(name: Profile["username"]) {
  return getProfileByName(name);
}
