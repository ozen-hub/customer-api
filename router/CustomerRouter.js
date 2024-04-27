const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

module.exports = function(client) {
    router.post('/', async (req, res) => {
        try {
            const customer = new Customer(req.body);
            await customer.save();
            res.status(201).json(customer);
          //  client.del(req.originalUrl);
        } catch (error) {
            console.error('Error saving customer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.get('/', async (req, res) => {
        try {
            const customers = await Customer.find();
            res.status(200).json(customers);
          //  client.setEx(req.originalUrl, 3600, JSON.stringify(customers)); // Corrected setex function call
        } catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.get('/:id', getCustomer, async (req, res) => {
        res.status(200).json(res.customer);
    });

    router.delete('/:id', getCustomer, async (req, res) => {
        try {
            await res.customer.remove();
            res.status(204).json({ message: 'Customer deleted' });
           // client.del(req.originalUrl);
        } catch (error) {
            console.error('Error deleting customer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    async function getCustomer(req, res, next) {
        try {
            const customer = await Customer.findById(req.params.id);
            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.customer = customer;
            next();
        } catch (error) {
            console.error('Error getting customer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    return router;
};
