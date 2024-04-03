const express = require('express');
const bodyParser = require('body-parser');
const router = require('./Login');
const cors = require('cors')
const personSchema = require('../models/pdetails');
const mongoose = require('mongoose');
const Person = mongoose.model("person_detail", personSchema);
const authoritySchema = require("../models/authoritySchema");
const Professor = mongoose.model("authority", authoritySchema);


// const nodemailer = require('nodemailer');

const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());


router.post('/fetchmemodetails', async(req, res) => {
    try {
        console.log("enter");
        const { no_plate } = req.body;
        // console.log(luser);
        const p = await Person.findOne({ no_plate: no_plate });
        // console.log("bbeeffooree");

        const result = {
            message: `Received gresult: ${no_plate}`,
            name: p.name,
            email: p.email,
            address: p.address,
            no_plate: p.no_plate,
            phone: p.phone,
            vehicle_type: p.vehicle_type,
            date_of_birth: p.date_of_birth,

        };


        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;