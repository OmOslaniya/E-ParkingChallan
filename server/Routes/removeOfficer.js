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

router.post('/removeofficer/:id', async(req, res) => {
    try {
        const officerUserName = req.params.id;
        console.log(officerUserName);
        console.log("remove ddd called for " + officerUserName);

        await Officer.deleteOne({ username: officerUserName });
        return res.json({
            message: 'Officer Data Deleted Successfully.',
        });
    } catch (error) {
        console.error('Error removing Officer from MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/removeallofficer', async(req, res) => {
    try {
        console.log("enter");
        const { uname } = req.body;

        const admin = await stationadmin.findOne({ username: uname });
        console.log(admin);
        const sname = admin.stationName;

        await Officer.deleteMany({ station: sname });

        return res.json({
            message: 'All Officer Data Deleted Successfully.',
        });
    } catch (error) {
        console.error('Error removing all officer from MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;