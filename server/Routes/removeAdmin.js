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

router.post('/removeadmin/:id', async(req, res) => {
    try {
        const adminUserName = req.params.id;
        console.log(adminUserName);
        console.log("removeee called for " + adminUserName);

        await stationadmin.deleteOne({ username: adminUserName });
        return res.json({
            message: 'Admin Data Deleted Successfully.',
        });
    } catch (error) {
        console.error('Error removing Officer from MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/removealladmin', async(req, res) => {
    try {
        console.log("enter");

        await stationadmin.collection.drop();
        return res.json({
            message: 'All Officer Data Deleted Successfully.',
        });
    } catch (error) {
        console.error('Error removing all officer from MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;