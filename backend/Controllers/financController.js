const financ = require("../Model/financModel");

// Function to insert a financ item
const addFinance = async (req, res, next) => {
    const { amount, date, category, transactionType } = req.body;

    let newFinanc;

    try {
        newFinanc = new financ({ amount, date, category, transactionType });
        await newFinanc.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to insert the item", error: err });
    }

    return res.status(200).json({ newFinanc });
};

// Function to get all financ items
const getAllFinance = async (req, res, next) => {
    let finance;

    try {
        finance = await financ.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to retrieve finance items", error: err });
    }

    return res.status(200).json({ finance });
};

// Function to get financ item by id
const getById = async (req, res, next) => {
    const id = req.params.id;

    let financeItem;

    try {
        financeItem = await financ.findById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to retrieve item", error: err });
    }

    if (!financeItem) {
        return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ financeItem });
};

// Function to update a financ item
const updateFinance = async (req, res, next) => {
    const id = req.params.id;
    const { amount, date, category, transactionType } = req.body;
  
    try {
      const updatedFinance = await financ.findByIdAndUpdate(id, {
        amount,
        date,
        category,
        transactionType
      }, { new: true });
  
      if (!updatedFinance) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      return res.status(200).json({ updatedFinance });
    } catch (err) {
      console.error("Error updating finance:", err);  // Detailed error log
      return res.status(500).json({ message: "Unable to update item details", error: err });
    }
  };
  

// Function to delete a financ item
const deleteFinance = async (req, res, next) => {
    const id = req.params.id; // This should match the route parameter
    console.log("Received ID for deletion:", id); // Log the received ID

    let deletedFinance;

    try {
        deletedFinance = await financ.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to delete item", error: err });
    }

    if (!deletedFinance) {
        return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ deletedFinance });
};


exports.addFinance = addFinance;
exports.getAllFinance = getAllFinance;
exports.getById = getById;
exports.updateFinance = updateFinance;
exports.deleteFinance = deleteFinance;
