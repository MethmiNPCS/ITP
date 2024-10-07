const express = require('express');
const router = express.Router();
const ProductController = require('../Controllers/ProductControllers');

// Define routes and connect to the appropriate controller functions
router.get('/', ProductController.getAllProducts);
router.post('/', ProductController.addProduct);
router.get('/:id', ProductController.getById);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
