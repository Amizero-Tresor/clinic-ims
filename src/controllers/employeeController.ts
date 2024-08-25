// src/controllers/employeeController.ts

import { Request, Response } from 'express';
import prisma from "../../prisma/prisma-client"

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeName
 *               - department
 *               - phoneNumber
 *             properties:
 *               employeeName:
 *                 type: string
 *               department:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Bad request
 */
export const createEmployee = async (req: Request, res: Response) => {
  const { employeeName, department, phoneNumber } = req.body;

  try {
    const upperCaseDepartment = department.toUpperCase(); // Convert to uppercase

    const employee = await prisma.employee.create({
      data: {
        employeeName,
        department: upperCaseDepartment,
        phoneNumber,
      },
    });

    return res.status(201).json(employee);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};
/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Retrieve a list of employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: A list of employees
 */

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany();
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The employee ID
 *     responses:
 *       200:
 *         description: The employee description by ID
 *       404:
 *         description: Employee not found
 */
export const getEmployeeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeName:
 *                 type: string
 *               department:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *       400:
 *         description: Bad request
 */

export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { employeeName, department, phoneNumber } = req.body;

  try {
    const employee = await prisma.employee.update({
      where: { id: Number(id) },
      data: {
        employeeName,
        department,
        phoneNumber,
      },
    });

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The employee ID
 *     responses:
 *       204:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.employee.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
