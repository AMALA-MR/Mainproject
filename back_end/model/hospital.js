const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');
const User = require('../model/user')

// Hospital Schemma
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
    confirm: {
        type: String, 
        default: '0',
        enum: ['0','1'],  
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
    //console.log(Hospital.findOne(query, callback))
    Hospital.findOne(query, callback);
}

// get confirmation pending doctor list for a particular hospital
module.exports.getPendingConfirm = function(id, callback){
    const query = {confirm: '0',hospital: id}
    User.find(query,callback).populate('hospital')
  }
  