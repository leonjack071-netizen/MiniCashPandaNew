const express = require("express");
const router = express.Router();

const {
  requestWithdraw,
  getAllWithdrawRequests,
  approveWithdraw,
  rejectWithdraw,
} = require("../controllers/withdrawController");

router.post("/withdraw", requestWithdraw);
router.get("/withdraws", getAllWithdrawRequests);
router.post("/withdraw/approve", approveWithdraw);
router.post("/withdraw/reject", rejectWithdraw);

module.exports = router;
