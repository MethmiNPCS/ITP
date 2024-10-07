const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Function to generate a custom ID in the format FMS_PM_00000
const generateCustomId = (nextId) => {
  const formattedId = String(nextId).padStart(5, '0'); // Ensure the ID is padded with zeros
  return `FMS_PM_${formattedId}`; // Construct the final ID
};

// Define the schema for products
const productSchema = new Schema({
  _id: {
    type: String,
    unique: true, // Ensure the ID is unique
  },
  type: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  MFD: {
    type: Date,
    required: true,
  },
  EXP: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

// Pre-save hook to generate the custom ID if it does not exist
productSchema.pre('save', async function (next) {
  try {
    if (!this._id) {
      const lastDocument = await mongoose.model('Product').findOne().sort({ createdAt: -1 });
      const nextId = lastDocument ? parseInt(lastDocument._id.split('_').pop()) + 1 : 1;
      this._id = generateCustomId(nextId); // Generate the new ID
    }
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

// Export the model
module.exports = mongoose.model('Product', productSchema);
