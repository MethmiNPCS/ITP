const express = require("express");
const stockrouter = express.Router();
// Insert Model
const Stock = require("../Model/StockModel");
// Insert Stock Controller
const StockController = require("../Controllers/StockControllers");

// Route Path for display all stocks
stockrouter.get("/", StockController.getAllStocks);

// Route Path for insert an item
stockrouter.post("/", StockController.addStocks);

// Route Path for get item by id
stockrouter.get("/:id", StockController.getById);

// Route Path for update stock details
stockrouter.put("/:id", StockController.updateStock);

// Route Path for update stock details
stockrouter.delete("/:id", StockController.deleteStock);

// Export
module.exports = stockrouter;