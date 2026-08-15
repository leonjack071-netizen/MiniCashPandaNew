const User = require("../models/User");
const History = require("../models/History");

const watchAd = async (req, res) => {
  try {
    const { telegramId } = req.body;

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }


    user.balance += 2;
    user.totalEarnings += 2;
    user.watchAdsCount += 1;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    if (user.adsTodayDate !== today) {
      user.adsTodayDate = today;
      user.adsToday = 0;
    }

    user.adsToday += 1;
    user.dailyAdEarnings += 2;
    user.lastAdWatchTime = new Date();

    await user.save();

    await History.create({
      telegramId: user.telegramId,
      type: "Watch Ad",
      amount: 2,
      status: "Success",
      message: "Earned from watching an ad",
    });

    return res.json({
      success: true,
      message: "Congratulations! You earned ৳2.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  watchAd,
};
