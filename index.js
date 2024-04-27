const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const redis = require('redis');
const customerRoute = require('./router/CustomerRouter');

const index = express();
const client = redis.createClient();

index.use(bodyParser.urlencoded({ extended: false }));
index.use(bodyParser.json());

const PORT = process.env.SERVER_PORT || 3000;

mongoose.connect('mongodb://localhost:27017/customerdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB');
});

client.on("error", function (error) {
    console.error('Redis connection error:', error);
});

index.get('/', cache, (req, res) => {
    res.send('Hello World!');
});

index.use('/customers', customerRoute(client)); // Pass the Redis client to the router

index.listen(PORT, () => {
    console.log('Server is up and running on port', PORT);
});

function cache(req, res, next) {
    const key = req.originalUrl;
    client.get(key, (err, data) => {
        if (err) {
            console.error('Redis cache error:', err);
            next();
        } else if (data !== null) {
            res.send(JSON.parse(data));
        } else {
            next();
        }
    });
}
