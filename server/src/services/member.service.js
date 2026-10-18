
import Member from "../models/Member.js";

export const registerMember = async (memberData) => {
  // 1. Get the details from the registration form.
  const fullName = memberData.fullName?.trim();
  const email = memberData.email?.trim().toLowerCase();
  const phone = memberData.phone?.trim();
  const county = memberData.county?.trim();
  const yearOfBirth = Number(memberData.yearOfBirth);

  // 2. Check that all required details are provided.
  if (
    !fullName ||
    !email ||
    !phone ||
    !county ||
    !memberData.yearOfBirth
  ) {
    const error = new Error(
      "Please provide all required membership details."
    );

    error.statusCode = 400;
    throw error;
  }

  // 3. Check whether the email is already registered.
  const existingEmail = await Member.findOne({ email });

  if (existingEmail) {
    const error = new Error(
      "This email is already registered."
    );

    error.statusCode = 409;
    throw error;
  }

  // 4. Check whether the phone number is already registered.
  const existingPhone = await Member.findOne({ phone });

  if (existingPhone) {
    const error = new Error(
      "This phone number is already registered."
    );

    error.statusCode = 409;
    throw error;
  }

  // 5. Save the new member in MongoDB.
  const member = await Member.create({
    fullName,
    email,
    phone,
    county,
    yearOfBirth,
    status: "confirmed",
  });

  // 6. Return the saved member's details.
  return {
    id: member._id,
    fullName: member.fullName,
    email: member.email,
    phone: member.phone,
    county: member.county,
    yearOfBirth: member.yearOfBirth,
    status: member.status,
    createdAt: member.createdAt,
  };
};


export const getRegisteredMemberCount = async () => {
  return await Member.countDocuments({ status: "confirmed" });
};

