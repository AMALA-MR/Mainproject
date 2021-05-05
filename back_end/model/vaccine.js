const mongoose = require('mongoose');

// Vaccine Schemma
const VaccineSchema = mongoose.Schema({
    vaccine_name: {
        type: String,
        required: true
    },
    price: {
        type: String
    }
});

const Vaccine = module.exports = mongoose.model('Vaccine', VaccineSchema);

// add new vaccine name to vaccine list
module.exports.addVaccine = function(newVaccine,callback){
    newVaccine.save(callback)
}