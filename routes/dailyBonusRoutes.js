const express = require("express");
const router = express.Router();

const {
  claimDailyBonus
} = require("../controllers/dailyBonusController");

router.post("/daily-bonus", claimDailyBonus);

module.exports = router;
