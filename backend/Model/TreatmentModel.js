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
    treatmentTime: [
        {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^\d{2}:\d{2}$/.test(v); // Ensures time is in HH:mm format
                },
                message: props => `${props.value} is not a valid time format!`
            }
        }
    ],
    frequency: {
        type: String,
        default: "Once a day", 
    },
    animalIDs: [
        {
            type: String,
            required: true
        }
    ]
});

module.exports = mongoose.model("TreatmentModel", treatmentSchema);
