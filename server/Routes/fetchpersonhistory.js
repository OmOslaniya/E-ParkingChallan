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

router.post('/fetchpersonhistory', async(req, res) => {
    try {

        let details = [];
        // console.log("wwwwwwww");
        const { no_plate } = req.body;
        // console.log(luser);
        const p = await Person.findOne({ no_plate: no_plate });
        const person_id = p._id;

        const person1 = await memohistory.find({ person: person_id });
        // console.log(police1);
        for (let person of person1) {
            let pid = person.authority;
            let date = person.memodate;
            let status = person.paydate;
            let flag = person.flag;
            let mno = person.memo_number;
            let rno = person.receipt_no;
            let tno = person.transaction_no;
            // console.log(date);
            const pdetail = await Professor.findOne({ _id: pid });

            let obj = {
                pobj: pdetail,
                date: date,
                status: status,
                flag: flag,
                mno: mno,
                rno: rno,
                tno: tno,
            }

            details.push(obj);

        }

        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;