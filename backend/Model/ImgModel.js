// backend/Model/imgModl.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for images
const imgSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Export the model
module.exports = mongoose.model('ImgModel', imgSchema);
