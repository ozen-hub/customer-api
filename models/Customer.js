const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: String,
    address: String,
    salary: Number
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
