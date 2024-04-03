const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mongoose = require("mongoose");
const authoritySchema = require("../models/authoritySchema");
const Professor = mongoose.model("authority", authoritySchema);
const secretKey = "THISISMYSECURITYKEYWHICHICANTGIVEYOU";
const stationadmin = require("../models/station_admin");
const mainadmin = require("../models/mainAdmin");


router.post("/login", async(req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    try {


        const professor = await Professor.findOne({ username: username });
        const admin = await stationadmin.findOne({ username: username });
        const madmin = await mainadmin.findOne({ username: username });


        if (!professor && !admin && !madmin) {
            return res.status(401).json({ error: "Incorrect Username or Password" });
        } else if (professor) {

            if (password == professor.password) {
                passwordMatch = true;

                // const mf = {
                //     username: "om5176",
                //     password: "omadmin",
                //     stationName: "Kapodra Police Station-Surat",
                //     police: professor._id
                // }
                // await stationadmin.create(mf);
            }

            if (!passwordMatch) {
                return res
                    .status(401)
                    .json({ error: "Incorrect Username or Password" });
            }
            passwordMatch = false;
            const payload = {
                user: {
                    id: professor._id,
                    username: professor.username,
                },

            };
            console.log("genrating token");
            const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
            res.cookie("token", token, { httpOnly: true });
            console.log("pushing in active");
            console.log("returning true");



            return res.status(200)

            .json({
                msg: "Login Successful",
                officerToken: token,
                username: username,
            });
        } else if (admin) {
            console.log("in admin: " + admin.password);
            if (password == admin.password) {
                console.log("pass matched!!");
                passwordMatch = true;

            }

            if (!passwordMatch) {
                console.log("in not matched");
                return res
                    .status(401)
                    .json({ error: "Incorrect Username or Password" });
            }
            passwordMatch = false;
            const payload = {
                user: {
                    id: admin._id,
                    username: admin.username,
                },
            };
            console.log("genrating token");
            const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
            res.cookie("token", token, { httpOnly: true });
            console.log("pushing in active");
            console.log("returning true");

            return res.status(202)

            .json({
                msg: "Login Successful",
                adminToken: token,
                username: username,
            });
        } else if (madmin) {
            console.log("in mainadmin: " + madmin.password);
            if (password == madmin.password) {
                console.log("pass matched!!!!!!");
                passwordMatch = true;
            }

            if (!passwordMatch) {
                console.log("in not matched");
                return res
                    .status(401)
                    .json({ error: "Incorrect Username or Password" });
            }

            passwordMatch = false;
            const payload = {
                user: {
                    id: madmin._id,
                    username: madmin.username,
                },
            };
            const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

            console.log("mmmm");
            return res.status(201).json({
                msg: "Login Successful",
                adminToken: token,
                username: username,
            });
        }
    } catch (error) {
        return res.status(401).json({ error: "Login Failed with exception" });
    }
});


module.exports = router;