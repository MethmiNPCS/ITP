const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new Schema({
    orderID: {
      type: Number,
      unique: true
    },
    orderType: {
      type: String,
      enum: ["Food", "Medicine"],
      required: true,
    },
    items: [
      {
        orderItem: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        }
      }
    ],
    supplier: {
        type: String, // or use Number if storing supplierID
        required: true,
    },
    orderDate: {
      type: String,
      default: Date.now, // Automatically sets the current date
    },
    
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "processed"],
      default: "pending", // Default status is "pending"
    }
  });
  
  // Apply auto-increment to orderID
  orderSchema.plugin(AutoIncrement, { inc_field: "orderID" });
  
  module.exports = mongoose.model(
    "OrderModel",
    orderSchema
  )
