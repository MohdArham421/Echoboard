import Profile from "../models/Profile.model.js";

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      gender,
      dob,
      professions,
    } = req.body;

    let profile = await Profile.findOne({
      user: "507f1f77bcf86cd799439011",
    });

    if (!profile) {
      profile = new Profile({
        user: "507f1f77bcf86cd799439011",
      });
    }

    profile.name = name;
    profile.email = email;
    profile.gender = gender;
    profile.dob = dob;
    profile.professions = professions;

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: "507f1f77bcf86cd799439011",
    });

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};