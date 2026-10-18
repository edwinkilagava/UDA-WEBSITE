import api from "./api.js";

/**
 * Register a new UDA member.
 */
export const registerMember = async (memberData) => {
  if (!memberData || typeof memberData !== "object") {
    throw new TypeError("Member registration details are required.");
  }

  const payload = {
    fullName: memberData.fullName?.trim(),
    email: memberData.email?.trim().toLowerCase(),
    phone: memberData.phone?.trim(),
    county: memberData.county?.trim(),
    yearOfBirth: Number(memberData.yearOfBirth),
  };

  const response = await api.post("/members/register", payload);
  const result = response.data;

  if (
    !result ||
    result.success !== true ||
    !result.data ||
    typeof result.data !== "object"
  ) {
    throw new Error(
      result?.message ||
        "The server returned an invalid membership registration response."
    );
  }

  return {
    success: true,
    message: result.message || "Registration completed successfully.",
    data: result.data,
  };
};

/**
 * Fetch the number of confirmed registered members.
 */
export const getRegisteredMemberCount = async () => {
  const response = await api.get("/members/count");
  const result = response.data;

  if (
    !result ||
    result.success !== true ||
    !Number.isSafeInteger(result.count) ||
    result.count < 0
  ) {
    throw new Error(
      result?.message || "Unable to retrieve the registered-member count."
    );
  }

  return result.count;
};