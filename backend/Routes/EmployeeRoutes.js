const express = require("express");
const emprouter = express.Router();

const EmployeeController = require("../Controllers/EmployeeControllers");

emprouter.get("/", EmployeeController.getAllEmployees);
emprouter.post("/", EmployeeController.addEmployee);
emprouter.get("/:id", EmployeeController.getById);
emprouter.put("/:id", EmployeeController.updateEmployee);
emprouter.delete("/:id", EmployeeController.deleteEmployee);
emprouter.post("/add-bonus", EmployeeController.addBonusByPosition); // Add bonus by position

module.exports = emprouter;
