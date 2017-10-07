const mongoose = require('mongoose');
const User = require('../models/user');

const RequestSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String,
        require: true
    },
    quantity: {
        noOfPersons: {
            type: Number
        }
    },
    address: {
        type: String
    }
});

const Request = module.exports = mongoose.model('Request', RequestSchema);

module.exports.getRequestsAll = function (callback) {
    Request.find(callback);
};

module.exports.getRequestById = function (id, callback) {
    Request.findById(id, callback);
};

module.exports.getRequestsByUserId = function (userId, callback) {
    const query = {
        userId: userId
    };
    Request.find(query, callback);
};

module.exports.addRequest = function (newRequset, callback) {
    newRequset.save(callback);
};