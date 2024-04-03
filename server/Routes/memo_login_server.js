const express = require("express");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const router = express.Router();
const personSchema = require('../models/pdetails');
const mongoose = require('mongoose');
const Person = mongoose.model("person_detail", personSchema);
const secretKey = "THISISMYSECURITYKEYWHICHICANTGIVEYOU";

const app = express();
app.use(cors());
app.use(bodyParser.json());

router.post("/memologin", async(req, res) => {
    console.log("abcd");
    const { vehicleNumber, dob } = req.body;
    console.log(vehicleNumber, dob);

    try {
        const professor = await Person.findOne({
            no_plate: vehicleNumber,

        });
        console.log(professor);

        if (!professor) {
            return res.status(401).json({ error: "Incorrect Date of Birth" });
        } else if (professor) {

            console.log(dob.toString());
            console.log(professor.date_of_birth);
            if (dob.toString() == professor.date_of_birth.toString()) {
                dobMatch = true;
                console.log("matchedd");
            }

            if (!dobMatch) {
                return res
                    .status(401)
                    .json({ error: "Incorrect Date of Birth" });
            }
            const payload = {
                user: {
                    id: professor._id,
                    no_plate: professor.no_plate,
                },

            };
            const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
            res.cookie("token", token, { httpOnly: true });
            return res.status(200).json({ msg: "Login Successful", userToken: token });
        }
    } catch (error) {
        return res.status(401).json({ error: "Login Failed" });
    }
});


module.exports = router;