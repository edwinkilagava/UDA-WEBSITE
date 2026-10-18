import {
  registerMember,
  getRegisteredMemberCount,
} from "../services/member.service.js";

export const registerMemberController = async (req, res, next) => {
  try {
    const member = await registerMember(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration completed successfully.",
      data: {
        id: member._id,
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        county: member.county,
        yearOfBirth: member.yearOfBirth,
        status: member.status,
        createdAt: member.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getRegisteredMemberCountController = async (
  req,
  res,
  next
) => {
  try {
    const count = await getRegisteredMemberCount();

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    return next(error);
  }
};