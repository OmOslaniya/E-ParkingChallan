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

router.post('/addsingleofficer', async(req, res) => {
    try {
        console.log("arrived");
        const officer = req.body;
        const { adminobj } = req.body;

        console.log(officer.addOfficerForm.name);
        // console.log(uname);
        await Officer.create({
            name: officer.addOfficerForm.name,
            station: adminobj.stationName,
            username: officer.addOfficerForm.username,
            password: officer.addOfficerForm.password,
            email: officer.addOfficerForm.email
        });
        return res.json({
            message: 'Officer Data Inserted Successfully.',
        });
    } catch (error) {
        console.error('Error removing Officer from MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;