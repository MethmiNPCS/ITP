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
  const { name, MFD, type,product, date, quantity } = req.body;
  if (!name || !MFD || !type || !product ||!date || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newProduct = new Product({ name, MFD, type,product, date, quantity });
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
  const { name, MFD, type,product,date, quantity } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, MFD, type, date,product, quantity },
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
    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    // If no product is found, return 404
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // If product is found and deleted, return success message with product details
    res.status(200).json({
      message: 'Product deleted successfully',
      deletedProduct, // Include the deleted product details in the response
    });
  } catch (error) {
    // Handle any errors
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
