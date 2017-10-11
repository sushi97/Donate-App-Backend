const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NGOSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    address: {
        type: String,
        require: true
    }
});

const NGO = module.exports = mongoose.model('NGO', NGOSchema);

module.exports.getNGOs = function (callback) {
    NGO.find(callback);
};

// module.exports.addNGO = function (newNGO, callback){
//     newNGO.save(callback);
// };