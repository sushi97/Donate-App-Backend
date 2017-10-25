const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        expires: 60*60,
        require: true
    }
});

const verToken = module.exports = mongoose.model('verToken', verTokenSchema);

module.exports.addToken = function(newVertoken, callback) {
    newVertoken.save(callback);
};

module.exports.verifyToken = function(token, callback) {
    const query = {
        token: token
    };
    verToken.find(query, callback);
};