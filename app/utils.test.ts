import { isProfile } from "app/utils";

test("isProfile returns false for non-profile objects", () => {
  expect(isProfile(undefined)).toBe(undefined);
  expect(isProfile(null)).toBe(null);
  expect(isProfile("")).toBe("");
  expect(isProfile({})).toBe(false);
  expect(isProfile({ notAValidField: "" })).toBe(false);
  expect(isProfile({ username: null })).toBe(false);
});

test("isProfile return true for profile objects", () => {
  expect(isProfile({ username: "Ron" })).toBe(true);
});
