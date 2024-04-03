const mongoose = require('mongoose');
const schema = mongoose.Schema;

const personSchema = new schema({

    name: String,
    no_plate: String,
    email: String,
    address: String,
    vehicle_type: String,
    date_of_birth: String,
});


module.exports = personSchema;