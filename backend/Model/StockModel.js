const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema({
    stockID:{
        type : String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    animal: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    EXD: {
        type: Date,
        required: true,
        get: (date) => date.toISOString().split('T')[0],
    },
    quantity: {
        type: Number,
        required: true,
    },
    unitPrice:{
        type : Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: function() {
            return this.unitPrice * this.quantity;
        }
    }    
}, { toJSON: { getters: true } });

module.exports = mongoose.model(
    "StockModel", // file name
    stockSchema // function name
)


