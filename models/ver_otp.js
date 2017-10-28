const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verOtpSchema = new Schema({
    email: {
        type: String,
        unique: true,
        require: true
    },
    otp: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        expires: 60*10,
        default: Date.now()
    }
});

const verOtp = module.exports = mongoose.model('verOtp', verOtpSchema);

module.exports.addVerOtp = function (newVerOtp, callback) {
    newVerOtp.save(callback);
};

module.exports.getByEmail = function (newEmail, callback) {
    const query = {
        email: newEmail
    };
    verOtp.findOne(query, callback);
};