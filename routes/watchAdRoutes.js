const express = require("express");
const router = express.Router();

const { watchAd } = require("../controllers/watchAdController");

router.post("/watch-ad", watchAd);

module.exports = router;
