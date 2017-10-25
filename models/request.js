const mongoose = require('mongoose');
const Users = require('../models/user');

// Validity Schema
const validitySchema = module.exports = mongoose.Schema({
    isValid: {
        type: Boolean,
        default: false
    },
    issuedOn: {
        type: Date,
        default: Date.now,
        require: true
    },
    validForHrs: {
        type: Number,
        default: '3',
    }
});

// Address Schema
const addressSchema = module.exports = mongoose.Schema({
    state: String,
    city: String,
    street: String
});

// Quantity Schema
const quantitySchema = module.exports = mongoose.Schema({
    number: {
        type: Number
    },
    items: {
        type: [String],
        require: true
    }
    // items: [{
    //     name: String,
    //     quantity: String
    // }],
    // description: {
    //     type: String
    // }
});

// Request Schema
const RequestSchema = module.exports = mongoose.Schema({
    type: {
        type: String,
        enum: ['donate', 'accept', 'money'],
        require: true
    },
    // issUser: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Users',
    //     require: true
    // },
    userTo: {
        type: String,
        require: true
    },
    userFrom: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    items:{
        type: [String]
    },
    address: {
        type: String
    },
    status: {
        type: String,
        enum: ['completed', 'ongoing'],
        default: 'ongoing'
    },
    validity: {
        type: validitySchema,
        require: true
    },
    issDate: {
        type: Date,
        default: Date.now(),
        require: true
    }
});

const Request = module.exports = mongoose.model('Request', RequestSchema);

module.exports.getAllAcceptRequests = function (callback) {
    let query = {
        type: 'accept'
    };
    Request.find(query, callback);
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

module.exports.getUserDonations = function (username, callback) {
    const query = {
        type: 'donate',
        userFrom: username
    };

    Request.find(query, callback);
};