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

router.post('/changehistory', async(req, res) => {
    try {
        const { no_plate, rno, tno } = req.body;
        console.log("abcdef");
        console.log(rno);
        console.log(tno);
        const p = await Person.findOne({ no_plate: no_plate });
        const p1 = p._id;
        console.log(p);
        // const mold = await memohistory.findOne({ person: p1, flag: "false" });
        // console.log(mold);
        const updatedMemo = {
            paydate: new Date(),
            flag: "true",
            receipt_no: rno ? rno.toString() : '', // Ensure rno is not undefined
            transaction_no: tno ? tno.toString() : '', // Ensure tno is not undefined
        };

        const m = await memohistory.findOneAndUpdate({ person: p1, flag: "false" }, { $set: updatedMemo }, { new: true });
        console.log("m is ");
        console.log(m);
        res.json(m);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;