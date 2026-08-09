const History = require("../models/History");

const getHistory = async (req, res) => {
  try {
    const { telegramId } = req.body;

    const history = await History.find({
      telegramId,
    }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      history,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getHistory,
};
