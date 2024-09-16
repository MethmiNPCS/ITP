const express = require ("express");
const emprouter = express.Router();

//Insert Model
const Employee =require ("../Model/EmployeeModel");

//Insert Employee controller
const EmployeeController =require("../Controllers/EmployeeControllers");

emprouter.get("/", EmployeeController.getAllEmployees);
emprouter.post("/", EmployeeController.addEmployee);
emprouter.get("/:id", EmployeeController.getById);
emprouter.put("/:id", EmployeeController.updateEmployee);
emprouter.delete("/:id", EmployeeController.deleteEmployee);


//Export
module.exports =emprouter;



