const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const treatmentSchema = new Schema({
    treatmentID: {
        type: String,
        required: true
    },
    planDescription: {
        type: String,
        required: true
    },
    medicines: [
        {
            name: {
                type: String,
                required: true
            },
            dose: {
                type: String,
                required: true
            }
        }
    ],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    treatmentTime: {
        type: String, 
        required: true
    },
    frequency: {
        type: String,
        default: "Every Day", 
      },
    animalIDs: [
        {
            type: String,
            required: true
        }
    ]
});

module.exports = mongoose.model(
    "TreatmentModel",
    treatmentSchema
)