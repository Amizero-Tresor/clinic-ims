  import { Request, Response } from 'express';
  import prisma from "../../prisma/prisma-client";
  import { parseISO, formatISO } from 'date-fns';

  /**
   * @swagger
   * tags:
   *   name: Transactions
   *   description: Transaction management
   */

  /**
   * @swagger
   * /transactions/incoming:
   *   post:
   *     summary: Create an incoming transaction
   *     tags: [Transactions]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               productName:
   *                 type: string
   *               quantity:
   *                 type: integer
   *               expirationDate:
   *                 type: string
   *                 format: date
   *     responses:
   *       201:
   *         description: Incoming transaction created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 productName:
   *                   type: string
   *                 quantity:
   *                   type: integer
   *                 expirationDate:
   *                   type: string
   *                   format: date
   *       400:
   *         description: Product not found
   *       500:
   *         description: Server error
   */
  export const createIncomingTransaction = async (req: Request, res: Response) => {
    let { productName, quantity, expirationDate } = req.body;
  
    try {
      // Ensure expirationDate is correctly formatted as an ISO string
      expirationDate = formatISO(parseISO(expirationDate));
  
      // Fetch the product to ensure it exists
      const product = await prisma.product.findUnique({
        where: { productName },
      });
  
      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }
  
      // Create an incoming transaction using product relation
      const transaction = await prisma.incomingTransaction.create({
        data: {
          quantity,
          expirationDate: new Date(expirationDate), 
          product: { connect: { id: product.id } }, 
        },
      });
  
      // Upsert the stock record
      await prisma.stock.upsert({
        where: { id: product.id },
        update: {
          quantity: { increment: quantity },
          expirationDate: new Date(expirationDate),
        },
        create: {
          quantity,
          expirationDate: new Date(expirationDate),
          product: { connect: { id: product.id } },
        },
      });
  
      return res.status(201).json(transaction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', error });
    }
  };
  

  /**
   * @swagger
   * /transactions/outgoing:
   *   post:
   *     summary: Create an outgoing transaction
   *     tags: [Transactions]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               productName:
   *                 type: string
   *               quantity:
   *                 type: integer
   *               employeeName:
   *                 type: string
   *               employeePhone:
   *                 type: string
   *     responses:
   *       201:
   *         description: Outgoing transaction created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 productName:
   *                   type: string
   *                 quantity:
   *                   type: integer
   *                 employeeName:
   *                   type: string
   *                 employeePhone:
   *                   type: string
   *       400:
   *         description: Product or Employee not found, or not enough stock
   *       500:
   *         description: Server error
   */
  export const createOutgoingTransaction = async (req: Request, res: Response) => {
    const { productName, quantity, employeeName, employeePhone } = req.body;

    try {
      const product = await prisma.product.findUnique({
        where: { productName },
      });

      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }

      const employee = await prisma.employee.findUnique({
        where: {
          employeeName_phoneNumber: { employeeName, phoneNumber: employeePhone },
        },
      });

      if (!employee) {
        return res.status(400).json({ message: 'Employee not found' });
      }

      const stock = await prisma.stock.findUnique({
        where: { id: productName },
      });

      if (!stock || stock.quantity < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }

      const transaction = await prisma.outgoingTransaction.create({
        data: {
          quantity,
          product: { connect: { id: product.id } },
          employee: { connect: { id: employee.id } },
        },
      });

      await prisma.stock.update({
        where: { id: productName },
        data: {
          quantity: { decrement: quantity },
        },
      });

      return res.status(201).json(transaction);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server error', error });
    }
  };

  /**
   * @swagger
   * /transactions/incoming/{id}:
   *   get:
   *     summary: Get an incoming transaction by ID
   *     tags: [Transactions]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The transaction ID
   *     responses:
   *       200:
   *         description: Transaction retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 productName:
   *                   type: string
   *                 quantity:
   *                   type: integer
   *                 expirationDate:
   *                   type: string
   *                   format: date
   *                 product:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                     productName:
   *                       type: string
   *       404:
   *         description: Transaction not found
   *       500:
   *         description: Server error
   */
  export const getIncomingTransactionById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const transaction = await prisma.incomingTransaction.findUnique({
        where: { id: Number(id) },
        include: {
          product: true,
        },
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      return res.status(200).json(transaction);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  };

  /**
   * @swagger
   * /transactions/outgoing/{id}:
   *   get:
   *     summary: Get an outgoing transaction by ID
   *     tags: [Transactions]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The transaction ID
   *     responses:
   *       200:
   *         description: Transaction retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 productName:
   *                   type: string
   *                 quantity:
   *                   type: integer
   *                 employeeName:
   *                   type: string
   *                 employeePhone:
   *                   type: string
   *                 product:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                     productName:
   *                       type: string
   *                 employee:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                     employeeName:
   *                       type: string
   *                     phoneNumber:
   *                       type: string
   *       404:
   *         description: Transaction not found
   *       500:
   *         description: Server error
   */
  export const getOutgoingTransactionById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const transaction = await prisma.outgoingTransaction.findUnique({
        where: { id: Number(id) },
        include: {
          product: true,
          employee: true,
        },
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      return res.status(200).json(transaction);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  };

  /**
   * @swagger
   * /transactions/incoming:
   *   get:
   *     summary: Retrieve a list of incoming transactions
   *     tags: [Transactions]
   *     responses:
   *       200:
   *         description: A list of incoming transactions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   productName:
   *                     type: string
   *                   quantity:
   *                     type: integer
   *                   expirationDate:
   *                     type: string
   *                     format: date
   *       500:
   *         description: Server error
   */
  export const getIncomingTransactions = async (req: Request, res: Response) => {
    try {
      const incomingTransactions = await prisma.incomingTransaction.findMany();
      return res.status(200).json(incomingTransactions);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  };

  /**
   * @swagger
   * /transactions/outgoing:
   *   get:
   *     summary: Retrieve a list of outgoing transactions
   *     tags: [Transactions]
   *     responses:
   *       200:
   *         description: A list of outgoing transactions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   productName:
   *                     type: string
   *                   quantity:
   *                     type: integer
   *                   employeeName:
   *                     type: string
   *                   employeePhone:
   *                     type: string
   *       500:
   *         description: Server error
   */
  export const getOutgoingTransactions = async (req: Request, res: Response) => {
    try {
      const outgoingTransactions = await prisma.outgoingTransaction.findMany();
      return res.status(200).json(outgoingTransactions);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  };
