const mongoose = require('mongoose');

// schedule booking Schemma
const ScheduleSchema = mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    allocated_amount: {
        type: String,
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
})

const Schedule = module.exports = mongoose.model('Schedule', ScheduleSchema);


// created new schedule 
module.exports.addSchedule = function(newSchedule,callback){
    newSchedule.save(callback)
}