const express = require('express');
const bodyParser = require('body-parser');
const router = require('./Login');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());


router.post('/getreceipt', async(req, res) => {
    function generateRandomNumber() {
        const min = 1000000000;
        const max = 9999999999;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    try {

        const result = generateRandomNumber();


        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;