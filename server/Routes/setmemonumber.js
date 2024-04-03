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

router.post('/setmemonumber', async(req, res) => {
    try {
        console.log("arrived");
        const { no_plate, mno } = req.body;
        console.log("abcdef");
        console.log("data is here");
        console.log(mno);
        const p = await Person.findOne({ no_plate: no_plate });
        const p1 = p._id;

        const m = await memohistory.findOneAndUpdate({ person: p1, flag: "false" }, {
            $set: {
                memo_number: mno + '',
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;