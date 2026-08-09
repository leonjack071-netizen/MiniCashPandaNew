const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    telegramId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Success",
    },

    message: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model("History", historySchema);
