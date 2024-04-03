const mongoose = require('mongoose');
const schema = mongoose.Schema;
const personSchema = require('../models/pdetails');
const authoritySchema = require("../models/authoritySchema");
const pmodel = mongoose.model('person_detail', personSchema);
const amodel = mongoose.model('authority', authoritySchema);

const memoschema = new schema({
    authority: {
        type: schema.Types.ObjectId,
        ref: 'amodel'
    },

    person: {
        type: schema.Types.ObjectId,
        ref: 'pmodel'
    },

    flag: String,
    memodate: String,
    paydate: String,
    receipt_no: String,
    transaction_no: String,
    memo_number: String,
});

const memomodel = mongoose.model('memo_history', memoschema);
module.exports = memomodel;