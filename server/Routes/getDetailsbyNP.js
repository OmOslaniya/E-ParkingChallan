const express = require('express');
const bodyParser = require('body-parser');
const router = require('./Login');
const cors = require('cors')
const personSchema = require('../models/pdetails');
const mongoose = require('mongoose');
const Person = mongoose.model("person_detail", personSchema);
const authoritySchema = require("../models/authoritySchema");
const Professor = mongoose.model("authority", authoritySchema);
const memohistory = require("../models/memo_history");
const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());

router.post('/getdetailsbynp', async(req, res) => {
    try {
        // let details = [];
        const { plateNumber } = req.body;
        console.log(plateNumber);




    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;