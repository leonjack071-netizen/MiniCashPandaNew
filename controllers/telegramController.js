const TelegramBot = require("node-telegram-bot-api").default;

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: false,
});

const checkChannel = async (req, res) => {
  try {
    const { telegramId } = req.body;

    const member = await bot.getChatMember(
      process.env.CHANNEL_USERNAME,
      telegramId
    );

    const joined = [
      "creator",
      "administrator",
      "member"
    ].includes(member.status);

    return res.json({
      success: true,
      joined,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      joined: false,
      message: error.message,
    });
  }
};

const checkGroup = async (req, res) => {
  try {
    const { telegramId } = req.body;

    const member = await bot.getChatMember(
      process.env.GROUP_USERNAME,
      telegramId
    );

    const joined = [
      "creator",
      "administrator",
      "member"
    ].includes(member.status);

    return res.json({
      success: true,
      joined,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      joined: false,
      message: error.message,
    });
  }
};

module.exports = {
  checkChannel,
  checkGroup,
};
