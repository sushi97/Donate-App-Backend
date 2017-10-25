const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Users = require('../models/user');
const Requests = require('../models/request');
const emailer = require('../util/emailer');


// GET all Accept requests
router.get('/accept', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Requests.getAllAcceptRequests((err, requests) => {
        res.json(requests);
    });
});


// POST a Donate request
router.post('/donate', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0)
        return res.send(400);

    let newRequest = new Requests({
        type: 'donate',
        userTo: req.body.userTo,
        userFrom: req.user.name,
        quantity: req.body.quantity,
        items: req.body.items,
        address: req.body.address
        // validity: req.body.validity
    });

    emailer.sendAvaliableDonerEmail('sushrutshimpi@gmail.com', req.body.userFrom);

    // console.log(newRequest);
    Requests.addRequest(newRequest, (err, request) => {
        if (err) {
            res.json([{
                success: false,
                msg: 'Failed to accept request'
            }]);
        } else {
            res.json([{
                success: true,
                msg: 'Request accepted',
                id: request._id
            }]);
        }
    });
});


// POST a Accept request
router.post('/accept', (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0)
        return res.send(400);

    let newRequest = new Requests({
        type: 'accept',
        userTo: req.body.userTo,
        quantity: req.body.quantity,
        items: req.body.items,
        address: req.body.address
        //validity: req.body.validity
    });
    console.log(newRequest);
    Requests.addRequest(newRequest, (err, request) => {
        if (err) {
            res.json([{
                success: false,
                msg: 'Failed to accept request'
            }]);
        } else {
            res.json([{
                success: true,
                msg: 'Request accepted',
                id: request._id
            }]);
        }
    });
});

// GET all User's Donations requests
router.get('/donate', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Requests.getUserDonations(req.user.name, (err, requests) => {
        res.json(requests);
    });
});

module.exports = router;