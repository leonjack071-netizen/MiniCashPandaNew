const express = require("express");
const router = express.Router();

const {
  registerUser,
  getUser,
  getReferrals,
} = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/get-user", getUser);

router.post("/get-referrals", getReferrals);

module.exports = router;
