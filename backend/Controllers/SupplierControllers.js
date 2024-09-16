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


// Export functions to routes
exports.getAllSuppliers = getAllSuppliers;
exports.addSupplier = addSupplier;
exports.getBySupplierID = getBySupplierID;
exports.getBySupplierType = getBySupplierType;
exports.updateSupplier = updateSupplier;

