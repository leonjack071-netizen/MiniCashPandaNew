const express = require("express");
const router = express.Router();

const {
  checkChannel,
  checkGroup
} = require("../controllers/telegramController");

router.post("/check-channel", checkChannel);
router.post("/check-group", checkGroup);

module.exports = router;
