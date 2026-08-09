const User = require("../models/User");
const History = require("../models/History");
const Withdraw = require("../models/Withdraw");

const requestWithdraw = async (req, res) => {
  try {
    const { telegramId, amount, method, accountNumber } = req.body;

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (amount < 500) {
      return res.status(400).json({
        success: false,
        message: "Minimum withdraw amount is ৳500.",
      });
    }
    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance.",
      });
    }

    const fee = amount * 0.10;
    const receiveAmount = amount - fee;

    const withdraw = new Withdraw({
      telegramId,
      amount,
      fee,
      receiveAmount,
      method,
      accountNumber,
    });

    await withdraw.save();

await History.create({
  telegramId: user.telegramId,
  type: "Withdraw",
  amount: amount,
  status: "Pending",
  message: "Withdraw request submitted",
});

    user.balance -= amount;
    await user.save();

    return res.json({
      success: true,
      message: "Withdraw request submitted successfully.",
      withdrawAmount: amount,
      fee: fee,
      receiveAmount: receiveAmount,
      status: "Pending",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllWithdrawRequests = async (req, res) => {
  try {
    const withdraws = await Withdraw.find().sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      withdraws,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveWithdraw = async (req, res) => {
  try {
    const { withdrawId } = req.body;

    const withdraw = await Withdraw.findById(withdrawId);

    if (!withdraw) {
      return res.status(404).json({
        success: false,
        message: "Withdraw request not found.",
      });
    }

    if (withdraw.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "This withdraw request is already approved.",
      });
    }

    withdraw.status = "Completed";
    await withdraw.save();

    return res.json({
      success: true,
      message: "Withdraw request approved successfully.",
      status: withdraw.status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectWithdraw = async (req, res) => {
  try {
    const { withdrawId } = req.body;

    const withdraw = await Withdraw.findById(withdrawId);

    if (!withdraw) {
      return res.status(404).json({
        success: false,
        message: "Withdraw request not found.",
      });
    }

    if (withdraw.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Completed withdraw request cannot be rejected.",
      });
    }

    if (withdraw.status === "Rejected") {
      return res.status(400).json({
        success: false,
        message: "This withdraw request is already rejected.",
      });
    }

    const user = await User.findOne({
      telegramId: withdraw.telegramId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.balance += withdraw.amount;
    await user.save();

    withdraw.status = "Rejected";
    await withdraw.save();

    return res.json({
      success: true,
      message: "Withdraw request rejected successfully.",
      refundedAmount: withdraw.amount,
      status: withdraw.status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  requestWithdraw,
  getAllWithdrawRequests,
  approveWithdraw,
  rejectWithdraw,
};
