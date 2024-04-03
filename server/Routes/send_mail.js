const memohistory = require("../models/memo_history");
const personSchema = require('../models/pdetails');
const authoritySchema = require("../models/authoritySchema");
const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const link = 'http://localhost:3000/memo_login';
const pmodel = mongoose.model('person_detail', personSchema);
const amodel = mongoose.model('authority', authoritySchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deeposlaniya93@gmail.com', // Replace with your Gmail email
        pass: 'csxt twjj kiuk fbrj', // Use the generated app password here
    },
});

router.post('/sendEmail', upload.single('pdfFile'), async(req, res) => {
    const { to, subject, text, person, police, memo_number } = req.body;
    const pdfFile = req.file; // Assuming you're using multer
    console.log("printing");
    console.log(person);
    console.log(police);

    // const pdfFile = req.file;
    if (!pdfFile) {
        console.log(to);
        console.log("send email called");
    }
    /*if (!pdfFile) {
    return res.status(500).send('No PDF file provided');
    //clear
}*/

    const mailOptions = {
        from: 'deeposlaniya93@gmail.com', // Replace with your Gmail email
        to,
        subject,
        text: `${text}\n\nClick the following link: ${link}`,
        attachments: [{
            filename: 'details.pdf',

            content: pdfFile.buffer,
            encoding: 'base64',
        }],
    };
    console.log("about to end api");

    try {
        await transporter.sendMail(mailOptions);

        const p1 = await pmodel.findOne({ no_plate: person });
        const c1 = await amodel.findOne({ username: police });

        const p1id = p1._id;
        const c1id = c1._id;



        const mf = {
            authority: c1id,
            person: p1id,
            flag: "false",
            memodate: new Date(),
            paydate: "Unpaid",
            memo_number: memo_number,
        }
        memohistory.create(mf);
        res.status(200).send({
            message: 'Email sent successfully'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            message: 'Failed to send email'
        });
    }


});

module.exports = router;