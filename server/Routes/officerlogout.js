const express = require('express');
const multer = require('multer');
const router = express.Router();
const { default: mongoose } = require('mongoose');
const authoritySchema = require("../models/authoritySchema");
const Officer = mongoose.model("authority", authoritySchema);
const bodyParser = require('body-parser');
const stationadmin = require("../models/station_admin");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/logout", verifyToken, (req, res) => {

    const userId = req.user.userId;
    console.log("Logging out");
    console.log(userId);
    if (!activeSessions.some(session => session.username === userId)) {
        return res.status(401).json({ error: "Token already invalidated" });
    }


    console.log("passed removing");

    // Clear the token from the client side
    res.clearCookie("token");

    res.json({ message: "Logout successful" });
});


module.exports = router;