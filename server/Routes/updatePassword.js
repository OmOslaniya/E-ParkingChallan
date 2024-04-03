const express = require('express');
const bodyParser = require('body-parser');
const router = require('./Login');
const cors = require('cors')
const personSchema = require('../models/pdetails');
const mongoose = require('mongoose');
const authoritySchema = require("../models/authoritySchema");
const Officer = mongoose.model("authority", authoritySchema);
const port = 5000;


router.post('/updatepassword', async(req, res) => {
    try {
        const { password, email } = req.body;
        console.log(email);
        console.log(password);
        const officer = await Officer.findOne({ email: email });

        if (!officer) {
            return res.status(404).json({ message: 'Officer not found' });
        }

        officer.password = password;
        await officer.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: "Error while Updating password" });
    }
});

module.exports = router;