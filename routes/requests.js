const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Users = require('../models/user');
const Requests = require('../models/request');

router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Requests.getRequestsAll((err, requests) => {
        res.json(requests);
    });
});

router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0)
      return res.send(400);

    let newRequest = new Requests({
        userId: req.user._id,
        type: req.body.type,
        quantity: req.body.quantity,
        address: req.body.address
    });
    console.log(newRequest);
    Requests.addRequest(newRequest, (err, request) => {
        if (err) {
            res.json({
              success: false,
              msg: 'Failed to accept request'
            });
          } else {
            res.json({
              success: true,
              msg: 'Request accepted',
              id: request._id
            });
          }
    });
});

module.exports = router;