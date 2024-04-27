const express = require('express');
const router = express.Router();
const redis = require('redis');

const client = redis.createClient();

const Customer = require('../models/Customer');

function cache(req, res, next) {
    const key = req.originalUrl;
    client.get(key, (err, data) => {
        if (err) throw err;
        if (data !== null) {
            res.send(JSON.parse(data));
        } else {
            next();
        }
    })
}

router.post('/', async (req, resp) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        resp.status(201).json(customer);
        client.del(req.originalUrl);
    } catch (e) {
        resp.status(500).json(e);
    }
});

router.get('/', async (req, resp) => {
    const customers = await Customer.find();
    resp.status(200).json(customers);

    client.setEx(resp.originalUrl,3600,JSON.stringify(customers));

});

router.get('/:id', getCustomer, async (req, resp) => {
    resp.status(200).json(resp.customer);
});

router.delete('/:id', getCustomer, async (req, resp) => {
    try {
        await resp.customer.remove();
        resp.status(204).json({'message': 'deleted'});
        client.del(req.originalUrl);
    } catch (e) {
        resp.status(500).json(e);
    }
})

async function getCustomer(req, resp, next) {
    try {
        let customer = await Customer.findById(req.params.id);
        if (customer === null) {
            return resp.statusCode(404).json({'message': 'not found!'});
        }
        resp.customer = customer;
        next();
    } catch (e) {
        resp.status(500).json(e);
    }
}

module.exports = router;
