const User = require("../models/User");
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        if (
            username !== process.env.ADMIN_USERNAME ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        return res.json({
            success: true,
            message: "Admin login successful"
        });

    } catch (error) {
        console.error("Admin Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const User = require("../models/User");
        const Withdraw = require("../models/Withdraw");

        const totalUsers = await User.countDocuments();

        const balanceResult = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalBalance: {
                        $sum: "$balance"
                    }
                }
            }
        ]);

        const adsResult = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalAds: {
                        $sum: "$watchAdsCount"
                    }
                }
            }
        ]);

        const pendingWithdraw = await Withdraw.countDocuments({
            status: "Pending"
        });

        const totalBalance =
            balanceResult.length > 0
                ? balanceResult[0].totalBalance
                : 0;

        const totalAds =
            adsResult.length > 0
                ? adsResult[0].totalAds
                : 0;

        return res.json({
            success: true,
            stats: {
                totalUsers,
                totalBalance,
                totalAds,
                pendingWithdraw
            }
        });

    } catch (error) {

        console.error(
            "Dashboard Stats Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics"
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const User = require("../models/User");

        const users = await User.find({})
            .select(
                "telegramId username balance totalEarnings totalReferrals watchAdsCount createdAt"
            )
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            users
        });

    } catch (error) {

        console.error(
            "Get All Users Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load users"
        });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { telegramId } = req.query;

        if (!telegramId) {
            return res.status(400).json({
                success: false,
                message: "Telegram ID is required"
            });
        }

        const user = await User.findOne({ telegramId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {

        console.error(
            "Admin User Details Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    adminLogin,
    getDashboardStats,
    getAllUsers,
    getUserDetails
};
