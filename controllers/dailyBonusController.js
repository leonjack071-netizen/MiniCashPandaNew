const User = require("../models/User");
const History = require("../models/History");

const claimDailyBonus = async (req, res) => {
  try {
    const { telegramId } = req.body;

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const now = new Date();

    if (user.lastDailyBonusClaim) {
      const diff = now - user.lastDailyBonusClaim;

      if (diff < 24 * 60 * 60 * 1000) {
        return res.status(400).json({
          success: false,
          message:
            "Daily bonus already claimed. Come back tomorrow."
        });
      }
    }

    user.balance += 10;
    user.totalEarnings += 10;
    user.lastDailyBonusClaim = now;

    await user.save();

    await History.create({
      telegramId: user.telegramId,
      type: "Daily Bonus",
      amount: 10,
      status: "Success",
      message: "Claimed daily bonus"
    });

    return res.json({
      success: true,
      message:
        "Congratulations! You received ৳10 Daily Bonus."
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  claimDailyBonus
};

