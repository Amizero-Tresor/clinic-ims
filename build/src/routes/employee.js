// src/routes/employeeRoutes.ts
import express from 'express';
import { getEmployeeById, createEmployee, getEmployees, updateEmployee, deleteEmployee } from '../controllers/employeeController';
const router = express.Router();
router.post('/', createEmployee);
router.get('/', getEmployees);
router.get('/:id', getEmployeeById); // Route to get employee by ID
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
module.exports = router;
