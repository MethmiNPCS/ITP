const Stock = require("../Model/StockModel");

// Function to display all stocks
const getAllStocks = async(req, res, next) => {

    let stocks;

    // Get All stocks
    try {
        stocks = await Stock.find();
    } catch (err) {
        console.log(err);
    }
    // not found
    if(!stocks){
        return res.status(404).json({message:"Stock Item not found"});
    }
    // Display all stocks
    return res.status(200).json({stocks});
};

// Function to insert an item
const addStocks = async(req, res, next) => {

    const{name, animal, type, EXD, quantity, unit, instructions} = req.body;

    let stocks;

    try {
        stocks = new Stock({name, animal, type, EXD, quantity, unit, instructions});
        await stocks.save();
    } catch (err) {
        console.log(err);
    }
    //not inserting
    if(!stocks){
        return res.status(404).json({message: "Unable to insert the item"});
    }
    return res.status(200).json({ stocks });
}

// Function to get item details by id
const getById = async (req, res, next) => {

    const id = req.params.id;

    let stock;

    try {
        stock = await Stock.findById(id);
    } catch (err) {
        console.log(err);
    }
    //not inserting
    if(!stock){
        return res.status(404).json({message: "Item is not available"});
        }
    return res.status(200).json({ stock });
};

// Function to update user details
const updateStock = async (req, res, next) => {

    const id = req.params.id;
    const{name, animal, type, EXD, quantity, unit, instructions} = req.body;

    let stocks;

    try{
        stocks = await Stock.findByIdAndUpdate(id, 
            {name: name, animal:animal, type:type, EXD:EXD, quantity:quantity, unit:unit, instructions:instructions});
            stocks = await stocks.save();
    }catch(err){
        console.log(err);
    }
    //not updating
    if(!stocks){
        return res.status(404).json({message: "Unable to update item details"});
        }
    return res.status(200).json({ stocks });

};

// Function to delete a stock item
const deleteStock = async(req, res, next) => {
    const id = req.params.id;

    let stock;

    try {
        stock = await Stock.findByIdAndDelete(id)
    } catch (err) {
        console.log(err);
    }
    //not deleting
    if(!stock){
        return res.status(404).json({message: "Item is not available"});
        }
    return res.status(200).json({ stock });
}

// Exporting functions
exports.getAllStocks = getAllStocks;
exports.addStocks = addStocks;
exports.getById = getById;
exports.updateStock = updateStock;
exports.deleteStock = deleteStock;