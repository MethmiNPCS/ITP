const express = require("express");
const treatmentrouter = express.Router();

//Insert Model
const Treatment = require("../Model/TreatmentModel");

//Insert Treatment Controller
const TreatmentController = require("../Controllers/TreatmentControllers");

treatmentrouter.get("/",TreatmentController.getAllTreatments);
treatmentrouter.post("/",TreatmentController.addTreatment);
treatmentrouter.get("/:treatmentID",TreatmentController.getById);
treatmentrouter.put("/:treatmentID",TreatmentController.updateTreatment);
treatmentrouter.delete("/:treatmentID",TreatmentController.deleteTreatment);

//export
module.exports = treatmentrouter;
