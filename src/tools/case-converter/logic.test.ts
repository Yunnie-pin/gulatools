import { describe, expect, it } from "vitest"
import { convertCase } from "./logic"

describe("convertCase", () => {
  const input = "userProfile ID_value"

  it.each([
    ["camel", "userProfileIdValue"],
    ["pascal", "UserProfileIdValue"],
    ["snake", "user_profile_id_value"],
    ["constant", "USER_PROFILE_ID_VALUE"],
    ["kebab", "user-profile-id-value"],
    ["dot", "user.profile.id.value"],
    ["title", "User Profile Id Value"],
  ] as const)("converts to %s", (id, expected) => {
    expect(convertCase(input, id)).toBe(expected)
  })

  it("converts each line separately", () => {
    expect(convertCase("first name\nlast name", "snake")).toBe("first_name\nlast_name")
  })
})
