const express = require("express");
const router = express.Router();

// Insert model
const Supplier = require("../Model/SupplierModel");

// Insert supplier controller
const SupplierController = require("../Controllers/SupplierControllers");

// Create route paths
router.get("/", SupplierController.getAllSuppliers);
router.post("/", SupplierController.addSupplier);
router.get("/:supplierID", SupplierController.getBySupplierID);
router.get("/type/:supplierType", SupplierController.getBySupplierType);  // New route for fetching suppliers by type
router.put("/:supplierID", SupplierController.updateSupplier);



// Export
module.exports = router;
