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


router.post('/notifyAll', async(req, res) => {
    try {
        const { luser, memos } = req.body;
        console.log(memos);

        const emailArray = memos.map((memo) => memo.pobj.email);
        console.log(emailArray);

        for (const memo of memos) {
            const { pobj, date, memo_number } = memo;

            const emailContent = {
                subject: `Important Notice Regarding Unpaid Memo - ${memo_number}`,
                text: `
                    Dear ${pobj.name},

                    We hope this email finds you well. This is to notify you about the unpaid memo associated with your vehicle.

                    Memo Details:
                    Memo Number: ${memo_number}
                    Vehicle Plate Number: ${pobj.no_plate}
                    Date: ${new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}

                    Please take prompt action to settle the outstanding dues to avoid any inconvenience. If you have already made the payment, please disregard this notice.

                    Thank you for your attention.

                    Sincerely,
                    E-parking Challan Administry.
                `,
            };

            const mailOptions = {
                from: 'deeposlaniya93@gmail.com',
                to: pobj.email,
                subject: emailContent.subject,
                text: emailContent.text,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${pobj.email}`);
        }

        // Response on success
        res.status(200).json({ success: true, message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error);
        // Response on error
        res.status(500).json({ success: false, message: 'Error sending emails' });
    }

});


module.exports = router;