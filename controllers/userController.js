const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const History = require("../models/History");

const TelegramBot = require("node-telegram-bot-api").default;

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: false,
});

const getTelegramPhotoUrl = async (telegramId) => {
  try {
    const photos = await bot.getUserProfilePhotos(telegramId, {
      limit: 1,
    });

    if (
      !photos ||
      !photos.photos ||
      photos.photos.length === 0
    ) {
      return "";
    }

    const photo =
      photos.photos[0][photos.photos[0].length - 1];

    const file = await bot.getFile(photo.file_id);

    if (!file || !file.file_path) {
      return "";
    }

    return `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

  } catch (error) {
    console.log(
      "Telegram Photo Error:",
      error.message
    );

    return "";
  }
};


const registerUser = async (req, res) => {
  try {
    const { telegramId, username, referralCode } = req.body;

    let user = await User.findOne({ telegramId });

if (user) {

  const photoUrl =
    await getTelegramPhotoUrl(telegramId);

  if (photoUrl && user.photoUrl !== photoUrl) {
    user.photoUrl = photoUrl;
    await user.save();
  }

}

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

    const photoUrl =
  await getTelegramPhotoUrl(telegramId);

user = new User({
  telegramId,
  username: username || "",
  photoUrl: photoUrl,
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
}).select("telegramId username photoUrl");

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
