const express = require("express");
const router = express.Router();

const {
    adminLogin,
    getDashboardStats,
    getAllUsers,
    getUserDetails
} = require("../controllers/adminController");

router.post("/admin/login", adminLogin);

router.get(
    "/admin/dashboard-stats",
    getDashboardStats
);

router.get(
    "/admin/users",
    getAllUsers
);

router.get(
    "/admin/user-details",
    getUserDetails
);

module.exports = router;
