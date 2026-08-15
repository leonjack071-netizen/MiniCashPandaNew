const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const watchAdRoutes = require("./routes/watchAdRoutes");
const dailyBonusRoutes = require("./routes/dailyBonusRoutes");
const channelBonusRoutes = require("./routes/channelBonusRoutes");
const groupBonusRoutes = require("./routes/groupBonusRoutes");
const telegramRoutes = require("./routes/telegramRoutes");
const historyRoutes = require("./routes/historyRoutes");
const withdrawRoutes = require("./routes/withdrawRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend")));

app.use("/api", userRoutes);
app.use("/api", watchAdRoutes);
app.use("/api", dailyBonusRoutes);
app.use("/api", channelBonusRoutes);
app.use("/api", groupBonusRoutes);
app.use("/api", telegramRoutes);
app.use("/api", historyRoutes);
app.use("/api", withdrawRoutes);
app.use("/api", adminRoutes);

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "frontend/home/index.html")
    );
});

app.get("/home", (req, res) => {
    res.sendFile(
        path.join(__dirname, "frontend/home/index.html")
    );
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(
                `MiniCashPanda running on port ${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB Connection Error:",
            error.message
        );
    });
