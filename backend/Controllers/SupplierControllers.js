const Supplier = require("../Model/SupplierModel");

// Display all suppliers
const getAllSuppliers = async (req, res, next) => {
    let suppliers;
    try {
        suppliers = await Supplier.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to retrieve suppliers" });
    }

    if (!suppliers) {
        return res.status(404).json({ message: "Suppliers not found" });
    }

    return res.status(200).json({ suppliers });
};

// Add a new supplier
const addSupplier = async (req, res, next) => {
    const { supplierID, supplierName, supplierType, supplierEmail, supplierPhone } = req.body;
    let supplier;

    try {
        supplier = new Supplier({
            supplierID,
            supplierName,
            supplierType,
            supplierEmail,
            supplierPhone
        });
        await supplier.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to add supplier" });
    }
    return res.status(200).json({ supplier });
};

// Retrieve a supplier by supplierID
const getBySupplierID = async (req, res, next) => {
    const id = req.params.supplierID;

    let supplier;

    try {
        supplier = await Supplier.findOne({ supplierID: id });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to retrieve supplier" });
    }

    if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json({ supplier });
};

// Retrieve suppliers by type (Food or Medicine)
const getBySupplierType = async (req, res, next) => {
    const type = req.params.supplierType;

    let suppliers;
    try {
        suppliers = await Supplier.find({ supplierType: type });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to retrieve suppliers by type" });
    }

    if (!suppliers || suppliers.length === 0) {
        return res.status(404).json({ message: "No suppliers found for this type" });
    }

    return res.status(200).json({ suppliers });
};

// Update supplierPhone and supplierEmail by supplierID
const updateSupplier = async (req, res, next) => {
    const id = req.params.supplierID;
    const { supplierPhone, supplierEmail } = req.body;

    let supplier;

    try {
        supplier = await Supplier.findOneAndUpdate(
            { supplierID: id },
            { supplierPhone, supplierEmail },
            { new: true, runValidators: true }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to update supplier" });
    }

    if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json({ supplier });
};

// Get the count of all suppliers
const getSupplierCount = async (req, res, next) => {
    let supplierCount;

    try {
        supplierCount = await Supplier.countDocuments();  // Count the total suppliers
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to retrieve supplier count" });
    }

    return res.status(200).json({ count: supplierCount });
};

// Get the count of food and medicine suppliers
const getSupplierCategoryCount = async (req, res, next) => {
    try {
        // Count food suppliers
        const foodCount = await Supplier.countDocuments({ supplierType: "Food" });
        // Count medicine suppliers
        const medicineCount = await Supplier.countDocuments({ supplierType: "Medicine" });

        return res.status(200).json({ foodCount, medicineCount });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to retrieve supplier category counts" });
    }
};

// Get supplier email by supplier name
const getSupplierEmailByName = async (req, res, next) => {
    const { supplierName } = req.params; // Get supplier name from request parameters

    let supplier;

    try {
        supplier = await Supplier.findOne({ supplierName }); // Find supplier by name
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to retrieve supplier email" });
    }

    if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json({ email: supplier.supplierEmail }); // Send back the supplier email
};


// Export functions to routes
exports.getAllSuppliers = getAllSuppliers;
exports.addSupplier = addSupplier;
exports.getBySupplierID = getBySupplierID;
exports.getBySupplierType = getBySupplierType;
exports.updateSupplier = updateSupplier;
exports.getSupplierCount = getSupplierCount;
exports.getSupplierCategoryCount = getSupplierCategoryCount; 
exports.getSupplierEmailByName = getSupplierEmailByName;



