const express = require('express');
const router = express.Router();

const Customer = require('../models/Customer');

router.post('/', async (req, resp) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        resp.status(201).json(customer);
    } catch (e) {
        resp.status(500).json(e);
    }
});

router.get('/:id', getCustomer, async (req, resp) => {
    resp.status(200).json(resp.customer);
});

router.delete('/:id', getCustomer, async (req, resp) => {
    try {
        await resp.customer.remove();
        resp.status(204).json({'message': 'deleted'});
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
