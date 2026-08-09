const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  fee: {
    type: Number,
    required: true,
  },

  receiveAmount: {
    type: Number,
    required: true,
  },

  method: {
    type: String,
    required: true,
  },

  accountNumber: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Withdraw", withdrawSchema);
