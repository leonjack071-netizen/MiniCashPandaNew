const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const History = require("../models/History");

const registerUser = async (req, res) => {
  try {
    const { telegramId, username, referralCode } = req.body;

    let user = await User.findOne({ telegramId });

    if (user) {
      user.username = username || "";
      await user.save();

      return res.status(200).json({
        success: true,
        message: "User already registered.",
        user,
      });
    }

    const newReferralCode =
      "MCP" +
      uuidv4()
        .replace(/-/g, "")
        .substring(0, 6)
        .toUpperCase();

    user = new User({
      telegramId,
      username: username || "",
      balance: 20,
      totalEarnings: 20,
      referralCode: newReferralCode,
      referredBy: referralCode || "",
      newUserBonusClaimed: true,
    });

    if (referralCode) {
      const referrer = await User.findOne({
        referralCode: referralCode,
      });

      if (
        referrer &&
        referrer.telegramId !== telegramId
      ) {
        referrer.balance += 10;
        referrer.totalEarnings += 10;
        referrer.totalReferrals += 1;

        await History.create({
          telegramId: referrer.telegramId,
          type: "Referral Bonus",
          amount: 10,
          status: "Success",
          message: "Referral bonus received",
        });

        await referrer.save();
      }
    }

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};


const getUser = async (req, res) => {
  try {
    const { telegramId } = req.body;

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const today =
      new Date().toISOString().split("T")[0];

    if (user.adsTodayDate !== today) {
      user.adsTodayDate = today;
      user.adsToday = 0;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};


const getReferrals = async (req, res) => {
  try {
    const { telegramId } = req.body;

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const referrals = await User.find({
      referredBy: user.referralCode,
    }).select("telegramId username");

    return res.json({
      success: true,
      totalReferrals: referrals.length,
      referrals,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


module.exports = {
  registerUser,
  getUser,
  getReferrals,
};
