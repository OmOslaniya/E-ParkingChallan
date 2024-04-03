const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const router = require('./Login');
const cors = require('cors');
const personSchema = require('../models/pdetails');
const mongoose = require('mongoose');
const Person = mongoose.model("person_detail", personSchema);
const authoritySchema = require("../models/authoritySchema");
const Professor = mongoose.model("authority", authoritySchema);
const memohistory = require("../models/memo_history");
const stationadmin = require("../models/station_admin");

const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deeposlaniya93@gmail.com',
        pass: 'csxt twjj kiuk fbrj',
    },
});

router.post('/sendAnnouncementMailAdmin', async(req, res) => {
    try {
        const officers = await Professor.find({}, 'email');

        const emailAddresses = officers.map(officer => officer.email);

        for (const email of emailAddresses) {
            await transporter.sendMail({
                from: 'deeposlaniya93@gmail.com',
                to: email,
                subject: req.body.title,
                text: req.body.body
            });
        }

        console.log('Announcement emails sent successfully');
        res.status(200).json({ success: true, message: 'Announcement emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ success: false, message: 'Error sending emails' });
    }
});

router.post('/sendAnnouncementMailMainAdmin', async(req, res) => {
    try {
        const officers = await stationadmin.find({}, 'email');

        const emailAddresses = officers.map(officer => officer.email);
        console.log(emailAddresses);
        for (const email of emailAddresses) {
            await transporter.sendMail({
                from: 'deeposlaniya93@gmail.com',
                to: email,
                subject: req.body.title,
                text: req.body.body
            });
        }

        console.log('Announcement emails sent successfully');
        res.status(200).json({ success: true, message: 'Announcement emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ success: false, message: 'Error sending emails' });
    }
});



module.exports = router;