// src/routes/productRoutes.ts

import express from 'express';
import { getProductById, createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);  // Get a product by ID
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router
