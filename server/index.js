const mongoose = require('mongoose');
const express = require('express');
const app = express();
const portnumber = 5000;
const cors = require('cors');
const url = 'mongodb+srv://omoslaniya92:mongodb5176@om.byczp8k.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });

app.use(cors());


app.listen(portnumber, () => {
    console.log("Application started on port number " + portnumber);
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", `*`);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(express.json());


app.use('/', require("./Routes/Login"))
app.use('/', require("./Routes/fetch_pdetails"))
app.use('/', require("./Routes/send_mail"))
app.use('/', require("./Routes/memo_login_server"))
app.use('/', require("./Routes/fetch_memo_pdetails"))
app.use('/', require("./Routes/generateReceipt"))
app.use('/', require("./Routes/fetch_history"))
app.use('/', require("./Routes/change_history"))
app.use('/', require("./Routes/getflag"))
app.use('/', require("./Routes/fetchpersonhistory"))
app.use('/', require("./Routes/download"))
app.use('/', require("./Routes/memo_number"))
app.use('/', require("./Routes/setmemonumber"))
app.use('/', require("./Routes/removeOfficer"))
app.use('/', require("./Routes/viewOfficerdata"))
app.use('/', require("./Routes/addSingleOfficer"))
app.use('/', require("./Routes/fetchAdminData"))
app.use('/', require("./Routes/viewAdmin"))
app.use('/', require("./Routes/removeAdmin"))
app.use('/', require("./Routes/addSingleAdmin"))
app.use('/', require("./Routes/addVehicleDetail"))
app.use('/', require("./Routes/otpSender"))
app.use('/', require("./Routes/updatePassword"))
app.use('/', require("./Routes/processPayment"))
app.use('/', require("./Routes/getDetailsbyNP"))
app.use('/', require("./Routes/notifyEmail"))
app.use('/', require("./Routes/sendAnnounceMail"))