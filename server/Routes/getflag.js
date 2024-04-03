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

router.post('/getflag', async(req, res) => {
    try {
        // let details = [];
        const { no_plate } = req.body;
        console.log("abcdefefg");
        const p = await Person.findOne({ no_plate: no_plate });
        // console.log(p);
        console.log("entered");
        const p1 = p._id;
        // console.log(p);
        const person1 = await memohistory.find({ person: p1 });
        console.log(person1);
        // console.log("data is here");

        for (let person of person1) {
            let date = person.memodate;
            let status = person.paydate;
            let flag = person.flag;
            let mno = person.memo_number;

            let obj = {
                pobj: p,
                date: date,
                status: status,
                flag: flag,
                mno: mno,
            };


            if (flag === 'false') {
                // details.push(obj);
                res.json(obj);
            }
        }
        // console.log("this is the data ");
        // console.log(details);


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;