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

router.post('/fetchadmin', async(req, res) => {
    try {

        const { uname } = req.body;
        console.log("admin username " + uname);

        const obj = await stationadmin.findOne({
            username: uname,
        });
        console.log(obj);
        return res.json(obj);
    } catch (error) {
        console.error('Error while fetching officer from MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;