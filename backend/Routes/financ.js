const express = require('express');
const financRouter = express.Router();
const financController = require('../Controllers/financController');

// Define routes for financ
financRouter.get("/", financController.getAllFinance);    
financRouter.get("/:id", financController.getById);      // Get all financ records
financRouter.post("/", financController.addFinance);          // Add a new financ record
financRouter.put("/:id", financController.updateFinance);     // Update an existing financ record
financRouter.delete("/:id", financController.deleteFinance);  // Delete a specific financ record

module.exports = financRouter;


