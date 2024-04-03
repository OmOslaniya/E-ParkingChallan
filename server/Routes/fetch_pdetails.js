const express = require('express');
const bodyParser = require('body-parser');
const router = require('./Login');
const cors = require('cors')
const personSchema = require('../models/pdetails');
const mongoose = require('mongoose');
const Person = mongoose.model("person_detail", personSchema);
const authoritySchema = require("../models/authoritySchema");
const Professor = mongoose.model("authority", authoritySchema);
const stationadmin = require("../models/station_admin");
const { ObjectId } = require("mongoose").Types;
// const nodemailer = require('nodemailer');


const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());


// Your existing code ...

router.post('/fetchdetails', async(req, res) => {
    try {

        const { gresult, luser } = req.body;
        console.log(luser);
        const p = await Person.findOne({ no_plate: gresult });
        console.log("bbeeffooree");
        console.log(p);

        console.log(gresult);
        const lcop = await Professor.findOne({ username: luser });
        console.log(lcop);
        const station = lcop.station;
        const copname = lcop.username;

        // Process 'gresult' as needed
        // For demonstration purposes, just echoing the result back
        const result = {
            message: `Received gresult: ${gresult}`,
            name: p.name,
            email: p.email,
            address: p.address,
            no_plate: p.no_plate,
            phone: p.phone,
            station: station,
            vehicle_type: p.vehicle_type,
            lcop: copname,


        };


        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;