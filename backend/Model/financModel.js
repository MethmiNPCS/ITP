const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Custom ID generator
const generateCustomId = (nextId) => {
    const formattedId = String(nextId).padStart(5, '0'); // Ensure it's 5 digits long
    return `FMS_FM_${formattedId}`;
};

const financSchema = new Schema({
    _id: {
        type: String, // Use String type for custom ID
        default: null,
    },
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
        default: Date.now,
    }
});

// Middleware to assign custom ID before saving
financSchema.pre('save', async function (next) {
    if (!this._id) {
        const lastDocument = await mongoose.model('financModel').findOne().sort({ createdAt: -1 });
        const nextId = lastDocument ? parseInt(lastDocument._id.split('_').pop()) + 1 : 1;
        this._id = generateCustomId(nextId);
    }
    next();
});

module.exports = mongoose.model('financModel', financSchema);
