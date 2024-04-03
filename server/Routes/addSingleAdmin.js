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

router.post('/addsingleadmin', async(req, res) => {
    try {
        console.log("arrived add");
        const admin = req.body;
        console.log(admin);

        await stationadmin.create({
            name: admin.addOfficerForm.Name,
            stationName: admin.addOfficerForm.stationName,
            username: admin.addOfficerForm.username,
            password: admin.addOfficerForm.password,
            email: admin.addOfficerForm.email
        });
        return res.json({
            message: 'Admin Data Inserted Successfully.',
        });
    } catch (error) {
        console.error('Error while Inserting Admin Details in MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;