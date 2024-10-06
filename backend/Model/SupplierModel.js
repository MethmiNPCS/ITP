const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const supplierSchema = new Schema({
    supplierID: {
        type: Number,
        unique: true,
    },
    supplierName: {
        type: String,
        required: true,
    },
    supplierType: {
        type: String,
        enum: ["Food", "Medicine"],
        required: true,
    },
    supplierEmail: {
        type: String,
        required: true,
    },
    supplierPhone: {
        type: String,
        required: true,
    },
});

// Apply auto-increment to supplierID
supplierSchema.plugin(AutoIncrement, { inc_field: "supplierID" });

// Create and export the Supplier model
module.exports = mongoose.model("SupplierModel", supplierSchema);
