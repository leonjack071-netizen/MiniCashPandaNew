const express = require("express");
const router = express.Router();

const {
  claimChannelBonus
} = require("../controllers/channelBonusController");

router.post("/channel-bonus", claimChannelBonus);

module.exports = router;

