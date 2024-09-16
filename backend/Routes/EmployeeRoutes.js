const express = require ("express");
const router = express.Router();

//Insert Model
const Employee =require ("../Model/EmployeeModel");

//Insert Employee controller
const EmployeeController =require("../Controllers/EmployeeControllers");

router.get("/", EmployeeController.getAllEmployees);
router.post("/", EmployeeController.addEmployee);
router.get("/:id", EmployeeController.getById);
router.put("/:id", EmployeeController.updateEmployee);
router.delete("/:id", EmployeeController.deleteEmployee);


//Export
module.exports =router;



