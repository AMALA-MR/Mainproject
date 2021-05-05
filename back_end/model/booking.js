const mongoose = require('mongoose');

// Booking Schemma
const BookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const Booking = module.exports = mongoose.model('Booking', BookingSchema);
