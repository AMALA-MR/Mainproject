const mongoose = require('mongoose');

// Vaccination Schemma
const VaccinationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vaccine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vaccine',
        required: true
    },
    dose_taken : {
        type: String,
        require: true
    },
    first_dose_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    second_dose_date:{
        type: Date
    },
    status: {
        type: String,
    }
});

const Vaccination = module.exports = mongoose.model('Vaccination', VaccinationSchema);

module.exports.addVaccinationDetails =function(newValue,callback){
    newValue.save(callback)
}

module.exports.findUser = function(u_id,callback){
    const query = {user:u_id}
    Vaccination.findOne(query,callback).populate('user')
}