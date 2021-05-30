const mongoose = require('mongoose');

const VerifyUserSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    otp: {
        type: String,
        required: true
    }
});

const verifyUser = module.exports = mongoose.model('VerifyUser', VerifyUserSchema);

module.exports.createVerify = function(newdata,callback){
    newdata.save(callback)
}

