const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');

// Users Schemma
const HospitalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
      },
});

const Hospital = module.exports = mongoose.model('Hospital', HospitalSchema);

//encrypt password
module.exports.addHospital = async function(newHospital, callback){
    const salt = await bcrypt.genSaltSync(10)
    
    newHospital.password = await bcrypt.hashSync(newHospital.password,salt)

    newHospital.save(callback)
}

//check is hospital exist or not using hospital name
module.exports.getUserByName = function(name, callback){
    const query = {name: name}
    Hospital.findOne(query, callback);
}

//Decrypt password or compare password
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};
