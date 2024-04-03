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
const Razorpay = require('razorpay');
const crypto = require('crypto');
const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());


const PaymentDetailsSchema = mongoose.Schema({
    razorpayDetails: {
        orderId: String,
        paymentId: String,
        signature: String,
    },
    success: Boolean,
});

const PaymentDetails = mongoose.model('PatmentDetail', PaymentDetailsSchema);


router.post('/orders', async(req, res) => {
    try {

        console.log("enter process");
        const instance = new Razorpay({
            key_id: 'rzp_test_UXwDn93TnrUjql',
            key_secret: '9snsccyX3BiS5pWZTAixOq8R',
        });
        console.log("enter process 2");

        const options = {
            amount: 100000,
            currency: 'INR',
            receipt: 'receipt_order_74394',
        };

        console.log("enter process 3");

        const order = await instance.orders.create(options);
        console.log(order);
        console.log("enter process 4");

        if (!order) return res.status(500).send('Some error occured');

        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send(error.message || 'Internal Server Error');
    }
});

router.post('/success', async(req, res) => {
    try {
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        const shasum = crypto.createHmac('sha256', '9snsccyX3BiS5pWZTAixOq8R');
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpaySignature) {
            return res.status(400).json({ msg: 'Transaction not legit!' });
        }

        const newPayment = PaymentDetails({
            razorpayDetails: {
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
                signature: razorpaySignature,
            },
            success: true,
        });

        await newPayment.save();

        console.log("Payment success!");
        return res.json({
            msg: 'success',
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        console.error("Error in /success route:", error);
        return res.status(500).send(error.message || 'Internal Server Error');
    }
});



module.exports = router;