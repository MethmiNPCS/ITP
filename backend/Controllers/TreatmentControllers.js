const Treatment = require("../Model/TreatmentModel");
const Animal = require("../Model/AnimalModel");

const getAllTreatments = async (req, res, next) => {
    try {
        const treatments = await Treatment.find();
        if (!treatments) {
            return res.status(404).json({ message: "No treatments found" });
        }
        return res.status(200).json({ treatments });
    } catch (err) {
        console.error("Error fetching treatments:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const addTreatment = async (req, res, next) => {
    const { treatmentID, planDescription, medicines, startDate, endDate, treatmentTime, frequency, animalIDs } = req.body;

    try {
        /*
        // Check if all animalIDs exist in AnimalModel
        const validAnimals = await Animal.find({
            animalID: { $in: animalIDs }
        });

        // Validate the number of found animal IDs
        if (validAnimals.length !== animalIDs.length) {
            return res.status(400).json({ message: "Some animal IDs are invalid" });
        }
            */

        // Check if treatmentID already exists
        const existingTreatment = await Treatment.findOne({ treatmentID });
        if (existingTreatment) {
            return res.status(400).json({ message: "Treatment ID already exists" });
        }

        const treatment = new Treatment({
            treatmentID,
            planDescription,
            medicines,
            startDate,
            endDate,
            treatmentTime,  // treatmentTime is already an array in the model
            frequency,
            animalIDs
        });

        await treatment.save();
        return res.status(200).json({ treatment });

    } catch (err) {
        console.error("Error adding treatment:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const getById = async (req, res, next) => {
    const treatmentID = req.params.treatmentID;

    try {
        const treatment = await Treatment.findOne({ treatmentID });
        if (!treatment) {
            return res.status(404).json({ message: "Treatment Plan not found" });
        }
        return res.status(200).json({ treatment });
    } catch (err) {
        console.error("Error fetching treatment by ID:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateTreatment = async (req, res, next) => {
    const treatmentID = req.params.treatmentID;
    const { planDescription, medicines, startDate, endDate, treatmentTime, frequency, animalIDs } = req.body;

    try {
        const treatment = await Treatment.findOneAndUpdate(
            { treatmentID },
            { planDescription, medicines, startDate, endDate, treatmentTime, frequency, animalIDs },
            { new: true } // returns the updated document
        );

        if (!treatment) {
            return res.status(404).json({ message: "Treatment Plan not updated" });
        }
        return res.status(200).json({ treatment });

    } catch (err) {
        console.error("Error updating treatment:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const deleteTreatment = async (req, res, next) => {
    const treatmentID = req.params.treatmentID;

    try {
        const treatment = await Treatment.findOneAndDelete({ treatmentID });
        if (!treatment) {
            return res.status(404).json({ message: "Treatment Plan not deleted" });
        }
        return res.status(200).json({ treatment });

    } catch (err) {
        console.error("Error deleting treatment:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getAllTreatments = getAllTreatments;
exports.addTreatment = addTreatment;
exports.getById = getById;
exports.updateTreatment = updateTreatment;
exports.deleteTreatment = deleteTreatment;
