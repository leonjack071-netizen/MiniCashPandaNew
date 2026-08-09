const User = require("../models/User");
const History = require("../models/History");

const claimChannelBonus = async (req, res) => {
  try {
    const { telegramId } = req.body;

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.channelJoinBonusClaimed) {
      return res.status(400).json({
        success: false,
        message: "Channel bonus already claimed.",
      });
    }

    user.balance += 10;
    user.totalEarnings += 10;
    user.channelJoinBonusClaimed = true;

    await user.save();

    await History.create({
      telegramId: user.telegramId,
      type: "Channel Bonus",
      amount: 10,
      status: "Success",
      message: "Claimed channel join bonus",
    });

    return res.json({
      success: true,
      message:
        "Congratulations! You earned ৳10 Channel Join Bonus.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  claimChannelBonus,
};

