const express = require("express");
const supplierrouter = express.Router();

// Insert model
const Supplier = require("../Model/SupplierModel");

// Insert supplier controller
const SupplierController = require("../Controllers/SupplierControllers");

// Create route paths
supplierrouter.get("/count", SupplierController.getSupplierCount);
supplierrouter.get('/category-count', SupplierController.getSupplierCategoryCount);
supplierrouter.get("/", SupplierController.getAllSuppliers);
supplierrouter.post("/", SupplierController.addSupplier);
supplierrouter.get("/:supplierID", SupplierController.getBySupplierID);
supplierrouter.get("/type/:supplierType", SupplierController.getBySupplierType);  // New route for fetching suppliers by type
supplierrouter.put("/:supplierID", SupplierController.updateSupplier);





// Export
module.exports = supplierrouter;
