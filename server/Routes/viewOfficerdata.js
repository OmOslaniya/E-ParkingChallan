const express = require('express');
const multer = require('multer');
const router = express.Router();
const { default: mongoose } = require('mongoose');
const authoritySchema = require("../models/authoritySchema");
const Officer = mongoose.model("authority", authoritySchema);
const bodyParser = require('body-parser');
const stationadmin = require("../models/station_admin");


const storage = multer.memoryStorage();
router.use(bodyParser.json());


router.post('/officerdataadmin', async(req, res) => {
    try {
        const { username } = req.body;
        console.log(username);
        const admin = await stationadmin.findOne({
            username: username
        });
        // console.log(admin);
        const stationName = admin.stationName;
        // console.log(stationName);

        const Officers = await Officer.find({ station: stationName });
        console.log(Officers);
        if (Officers.length == 0) {
            return res.json("No Officers to display");
        }

        res.json(Officers);
    } catch (error) {
        console.error('Error fetching Officers :', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/searchofficer', async(req, res) => {
    try {
        console.log("arrived");
        const { searchUsername, uname } = req.body;

        const admin = await stationadmin.findOne({ username: uname });
        const sname = admin.stationName;

        const officers = await Officer.find({
            username: { $regex: new RegExp(searchUsername, 'i') },
            station: sname
        });

        if (officers.length === 0) {
            return res.json("No officers found");
        }

        res.json(officers);
    } catch (error) {
        console.error('Error searching officers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;