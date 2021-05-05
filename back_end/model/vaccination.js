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
        required: true
    },
    second_dose_date:{
        type: Date
    },

});

const Vaccination = module.exports = mongoose.model('Vaccination', VaccinationSchema);
