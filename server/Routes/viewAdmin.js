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


router.post('/admindata', async(req, res) => {
    try {

        const admin = await stationadmin.find({}).exec();

        if (admin.length == 0) {
            return res.json("No Admins to display");
        }

        res.json(admin);
    } catch (error) {
        console.error('Error fetching Officers :', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/searchAdmin', async(req, res) => {
    try {
        console.log("arrived2");
        const { searchUsername } = req.body;

        const officers = await stationadmin.find({
            stationName: { $regex: new RegExp(searchUsername, 'i') },

        });

        if (officers.length === 0) {
            return res.json("No admin found");
        }

        res.json(officers);
    } catch (error) {
        console.error('Error searching admin:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;