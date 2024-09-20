const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const financSchema = new Schema({
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        default: 0,
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    transactionType: {
        type: String,
        required: [true, "Transaction Type is required"],
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now, // Changed to Date.now to get the current timestamp
    }
});

module.exports = mongoose.model('financModel', financSchema);
