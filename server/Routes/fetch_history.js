const express = require('express');
const bodyParser = require('body-parser');
const router = require('./Login');
const cors = require('cors');
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


router.post('/fetchAllMemos', async(req, res) => {
    try {

        let details = [];
        console.log("wwwwwwww");
        const { luser } = req.body;
        console.log(luser);
        const p = await Professor.findOne({ username: luser });
        // console.log(p);
        const police_id = p._id;
        // console.log(police_id);
        const police1 = await memohistory.find({ authority: police_id });
        // console.log(police1);
        // console.log(police1);
        for (let police of police1) {
            let pid = police.person;
            let date = police.memodate;
            let status = police.paydate;
            let flag = police.flag;
            let memo_number = police.memo_number;
            // console.log(memo_number);
            const pdetail = await Person.findOne({ _id: pid });

            let obj = {
                pobj: pdetail,
                date: date,
                status: status,
                flag: flag,
                memo_number: memo_number,
            }
            details.push(obj);

        }

        res.json(details);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/fetchMemosByYearMonth', async(req, res) => {
    try {

        let details = [];
        const { luser, year, month } = req.body;
        console.log(year);
        console.log(month);
        const professor = await Professor.findOne({ username: luser });
        console.log("active");
        if (!professor) {
            return res.status(404).json({ error: 'Professor not found' });
        }

        const police_id = professor._id;
        console.log("aaa");

        const memosByYearMonth = await memohistory.find({
            authority: police_id,
        });

        console.log("All Memos:", memosByYearMonth);

        const filteredMemos = memosByYearMonth.filter(memo => {
            const memoDate = new Date(memo.memodate);
            const memoYear = memoDate.getFullYear();
            const memoMonth = memoDate.getMonth() + 1; // Months are zero-based

            console.log("Memo Date, Year, Month:", memoDate, memoYear, memoMonth);

            return memoYear === parseInt(year) && memoMonth === parseInt(month);
        });

        console.log("Filtered Memos:", filteredMemos);

        for (let memo of filteredMemos) {
            let pid = memo.person;
            let date = memo.memodate;
            let status = memo.paydate;
            let flag = memo.flag;
            let memo_number = memo.memo_number;

            const pdetail = await Person.findOne({ _id: pid });

            let obj = {
                pobj: pdetail,
                date: date,
                status: status,
                flag: flag,
                memo_number: memo_number,
            };


            details.push(obj);
        }
        console.log(details);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;