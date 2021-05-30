const mongoose = require('mongoose');

// Booking Schemma
const BookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'booked',
        enum:['booked','taken','cancel'],
    },
    created_at: {
        type: Date,
        default: Date.now,
      },
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

// find a particular user booking
module.exports.findBooking = function(id,callback){
    const query = {user:id}
    Booking.find(query,callback).populate('schedule')
}
// find a particular user booking
module.exports.findBook = function(id,status,callback){
    const query = {_id:id,status:status}
    Booking.findOne(query,callback).populate('schedule').populate('User')
}