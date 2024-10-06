const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const animalSchema = new Schema({
  animalID: {
    type: String,
    required: true,
  },
  animalType: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  weight: {
    type: Number,
  },
  breedingStatus: {
    type: String,
  },
  healthStatus: {
    type: String,
    required: true,
  },
  healthCondition: {
    type: String,
  },
  treatmentIDs: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("AnimalModel", animalSchema);
