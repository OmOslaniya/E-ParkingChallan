const express = require('express');
const multer = require('multer');
const router = express.Router();
const { default: mongoose } = require('mongoose');
const authoritySchema = require("../models/authoritySchema");
const Officer = mongoose.model("authority", authoritySchema);
const personSchema = require('../models/pdetails');
const Person = mongoose.model("person_detail", personSchema);
const bodyParser = require('body-parser');
const stationadmin = require("../models/station_admin");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/addvehicledetail', async(req, res) => {
    try {
        console.log("arrived");
        const v = req.body;
        console.log(v);

        await Person.create({
            name: v.addVehicleForm.name,
            date_of_birth: v.addVehicleForm.date_of_birth,
            address: v.addVehicleForm.address,
            vehicle_type: v.addVehicleForm.vehicle_type,
            email: v.addVehicleForm.email,
            no_plate: v.addVehicleForm.no_plate
        });
        return res.json({
            message: 'Vehicle Data Inserted Successfully.',
        });
    } catch (error) {
        console.error('Error while Inserting Vehicle Details in MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;