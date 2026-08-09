const express = require("express");
const router = express.Router();

const {
  getHistory
} = require("../controllers/historyController");

router.post("/history", getHistory);

module.exports = router;
