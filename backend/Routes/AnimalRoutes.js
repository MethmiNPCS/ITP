const express = require("express");
const animalrouter = express.Router();

//Insert Model
const Animal = require("../Model/AnimalModel");

//Insert Animal Controller
const AnimalController = require("../Controllers/AnimalControllers");

animalrouter.get("/",AnimalController.getAllAnimals);
animalrouter.post("/",AnimalController.addAnimals);
animalrouter.get("/:animalID",AnimalController.getById);
animalrouter.put("/:animalID",AnimalController.updateAnimal);
animalrouter.delete("/:animalID",AnimalController.deleteAnimal);


//export
module.exports = animalrouter;