const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Users = require('../models/user');
const Requests = require('../models/request');


// GET all Accept requests
router.get('/accept', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Requests.getAllAcceptRequests((err, requests) => {
        res.json(requests);
    });
});


// POST a Donate request
router.post('/donate', (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0)
      return res.send(400);

    let newRequest = new Requests({
        type: 'donate',
        userTo: req.body.userTo,
        userFrom: req.body.userFrom,
        quantity: req.body.quantity,
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


// POST a Accept request
router.post('/aaccept', (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0)
      return res.send(400);

    let newRequest = new Requests({
        type: 'accept',
        userTo: req.body.userTo,
        quantity: req.body.quantity,
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
router.get('/donate/:username', (req, res, next) => {
    Requests.getUserDonations(req.params.username, (err, requests) => {
        res.json(requests);
    });
});

module.exports = router;