const mongoose = require('mongoose');
const Hospital = require('../model/hospital')
const Vaccine = require('../model/vaccine')

// Stock Schemma
const StockSchema = mongoose.Schema({
    vaccine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vaccine',
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    available_stock: {
        type: String,
        required: true
    }
});

const Stock = module.exports = mongoose.model('Stock', StockSchema);

// add new stock for hospitals
module.exports.addStock = function(newStock,callback){
    newStock.save(callback)
}
