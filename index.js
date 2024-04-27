const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const index = express();

index.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
index.use(bodyParser.json())

const PORT = process.env.SERVER_PORT || 3000;

mongoose.connect('mongodb://localhost:27017/customerdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once('open', () => {
    console.log('connected');
})

index.listen(PORT, () => {
    console.log('up & running!');
})
