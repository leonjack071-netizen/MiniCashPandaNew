const express = require("express");
const router = express.Router();

const {
  claimGroupBonus
} = require("../controllers/groupBonusController");

router.post("/group-bonus", claimGroupBonus);

module.exports = router;

