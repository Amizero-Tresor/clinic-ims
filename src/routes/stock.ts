import express from 'express';
import { getStocks, getStockById } from '../controllers/stockController';

const router = express.Router();

router.get('/', getStocks);
router.get('/:id', getStockById);  // Route to get stock by ID

module.exports = router;
