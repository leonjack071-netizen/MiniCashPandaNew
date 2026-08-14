const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    default: "",
  },

  photoUrl: {
    type: String,
    default: "",
  },

  lastAdWatchTime: {
    type: Date,
    default: null,
  },

  dailyAdEarnings: {
    type: Number,
    default: 0,
  },

  lastDailyBonusClaim: {
    type: Date,
    default: null,
  },

  channelJoinBonusClaimed: {
    type: Boolean,
    default: false,
  },

  groupJoinBonusClaimed: {
    type: Boolean,
    default: false,
  },

  balance: {
    type: Number,
    default: 0,
  },

  totalEarnings: {
    type: Number,
    default: 0,
  },

  referralCode: {
    type: String,
    unique: true,
  },

  referredBy: {
    type: String,
    default: "",
  },

  totalReferrals: {
    type: Number,
    default: 0,
  },

  watchAdsCount: {
    type: Number,
    default: 0,
  },

  adsToday: {
    type: Number,
    default: 0,
  },

  adsTodayDate: {
    type: String,
    default: "",
  },

  dailyBonusClaimed: {
    type: Boolean,
    default: false,
  },

  channelJoined: {
    type: Boolean,
    default: false,
  },

  groupJoined: {
    type: Boolean,
    default: false,
  },

  newUserBonusClaimed: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
