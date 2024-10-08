// src/routes/transactionRoutes.ts
import express from 'express';
import { getIncomingTransactionById, getOutgoingTransactionById, createIncomingTransaction, createOutgoingTransaction, getIncomingTransactions, getOutgoingTransactions } from '../controllers/transactionController';
const router = express.Router();
router.post('/incoming', createIncomingTransaction);
router.post('/outgoing', createOutgoingTransaction);
router.get('/incoming', getIncomingTransactions);
router.get('/outgoing', getOutgoingTransactions);
router.get('/incoming/:id', getIncomingTransactionById); // Get an incoming transaction by ID
router.get('/outgoing/:id', getOutgoingTransactionById);
// Get an outgoing transaction by ID
module.exports = router;
