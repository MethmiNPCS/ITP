const Animal = require("../Model/AnimalModel");
const Treatment = require("../Model/TreatmentModel");

// Get all animals
const getAllAnimals = async (req, res, next) => {
  try {
    const animals = await Animal.find();
    return res.status(200).json({ animals });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add new animal
const addAnimals = async (req, res, next) => {
  const { animalID, animalType, gender, age, dateOfBirth, weight, breedingStatus, healthStatus, healthCondition, treatmentIDs } = req.body;

  try {
    const existingAnimal = await Animal.findOne({ animalID });
    if (existingAnimal) {
      return res.status(400).json({ message: "Animal ID already exists" });
    }

    const animal = new Animal({ animalID, animalType, gender, age, dateOfBirth, weight, breedingStatus, healthStatus, healthCondition, treatmentIDs });
    await animal.save();

    await Treatment.updateMany(
      { treatmentID: { $in: treatmentIDs } },
      { $addToSet: { animalIDs: animalID } } // $addToSet ensures no duplicates
    );

    return res.status(201).json({ animal });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get animal by ID
const getById = async (req, res, next) => {
  const animalID = req.params.animalID;

  try {
    const animal = await Animal.findOne({ animalID });
    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    let treatmentDetails = [];
    if (animal.treatmentIDs && animal.treatmentIDs.length > 0) {
      treatmentDetails = await Treatment.find({ treatmentID: { $in: animal.treatmentIDs } });
    }

    return res.status(200).json({ animal, treatments: treatmentDetails });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update
const updateAnimal = async (req, res, next) => {
    const animalID = req.params.animalID;
    const { animalType, gender, age, dateOfBirth, weight, breedingStatus, healthStatus, healthCondition, treatmentIDs } = req.body;

    let animal;

    try {
        // Fetch current animal data
        const currentAnimal = await Animal.findOne({ animalID });
        if (!currentAnimal) {
            return res.status(404).json({ message: "Animal not found" });
        }

        // Update the animal data
        animal = await Animal.findOneAndUpdate(
            { animalID },
            { animalType, gender, age, dateOfBirth, weight, breedingStatus, healthStatus, healthCondition, treatmentIDs },
            { new: true }
        );

        // Remove animalID from old treatments that are no longer selected
        const oldTreatmentIDs = currentAnimal.treatmentIDs;
        const removedTreatmentIDs = oldTreatmentIDs.filter(id => !treatmentIDs.includes(id));
        await Treatment.updateMany(
            { treatmentID: { $in: removedTreatmentIDs } },
            { $pull: { animalIDs: animalID } } // $pull removes the animalID
        );

        // Add animalID to new selected treatments
        const newTreatmentIDs = treatmentIDs.filter(id => !oldTreatmentIDs.includes(id));
        await Treatment.updateMany(
            { treatmentID: { $in: newTreatmentIDs } },
            { $addToSet: { animalIDs: animalID } } // $addToSet ensures no duplicates
        );

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!animal) {
        return res.status(404).json({ message: "Animal details not updated" });
    }
    return res.status(200).json({ animal });
};

// Delete
const deleteAnimal = async (req, res, next) => {
    const animalID = req.params.animalID;

    try {
        // Fetch the animal to get its treatmentIDs
        const animal = await Animal.findOne({ animalID });
        if (!animal) {
            return res.status(404).json({ message: "Animal not found" });
        }

        // Delete the animal
        await Animal.findOneAndDelete({ animalID });

        // Remove animalID from all treatments
        await Treatment.updateMany(
            { treatmentID: { $in: animal.treatmentIDs } },
            { $pull: { animalIDs: animalID } } 
        );

        return res.status(200).json({ message: "Animal deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};


exports.getAllAnimals = getAllAnimals;
exports.addAnimals = addAnimals;
exports.getById = getById;
exports.updateAnimal = updateAnimal;
exports.deleteAnimal = deleteAnimal;
