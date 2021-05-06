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
    slot:{
        type: String,
        required: true,
        enum:['10am-11am','11am-12pm','12pm-01pm','02pm-03pm','03pm-04pm']
    },
    status: {
        type: String,
        required: true,
        default: 'book',
        enum:['book','complete','cancel'],
    }
});

const Booking = module.exports = mongoose.model('Booking', BookingSchema);

//book time slot and date
module.exports.addBook = function(newBook, callback){
    newBook.save(callback)
}

//check date and time avaliable
module.exports.checkTimeSlot = function(date,slot,hospital,callback){
    const query = {date: date, slot: slot, hospital: hospital}
    Booking.find(query,callback).populate('hospital')
}

//view avaliable time slot
module.exports.avaliableSlot = function(date,hospital,callback){
    const query = {date: date, hospital: hospital}
    Booking.find(query,callback).populate('hospital')
}
