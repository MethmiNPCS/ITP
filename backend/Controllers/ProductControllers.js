const Product = require("../Model/ProductModel");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  const { type, product, price, quantity, MFD, EXP } = req.body;

  // Check for missing fields
  if (!type || !product || !price || !quantity || !MFD || !EXP) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate date fields
  const mfdDate = new Date(MFD);
  const expDate = new Date(EXP);
  if (isNaN(mfdDate.getTime()) || isNaN(expDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  try {
    const newProduct = new Product({
      type,
      product,
      price,
      quantity,
      MFD: mfdDate,
      EXP: expDate
    });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error adding product' });
  }
};

// Get product by ID
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { type, product, price, quantity, MFD, EXP } = req.body;

  // Check for missing fields
  if (!type || !product || !price || !quantity || !MFD || !EXP) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate date fields
  const mfdDate = new Date(MFD);
  const expDate = new Date(EXP);
  if (isNaN(mfdDate.getTime()) || isNaN(expDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { type, product, price, quantity, MFD: mfdDate, EXP: expDate },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  getById,
  updateProduct,
  deleteProduct
};
