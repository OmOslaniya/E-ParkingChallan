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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deeposlaniya93@gmail.com', // Replace with your Gmail email
        pass: 'csxt twjj kiuk fbrj', // Use the generated app password here
    },
});

const generateOTP = () => {

    return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/sendotp',
    async(req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        console.log(email);
        const otp = generateOTP();

        const mailOptions = {
            from: 'deeposlaniya93@gmail.com', // Replace with your Gmail email
            to: email,
            subject: 'E-Parking Challan System OTP',
            text: `Your OTP for E-Parking Challan System is: ${otp}`

        };


        try {
            await transporter.sendMail(mailOptions);

            res.status(200).json({
                otp: otp,
                success: true,
                message: 'OTP sent successfully'
            });
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send OTP'
            });
        }


    });

module.exports = router;