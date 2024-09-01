import prisma from '../config/db';
/**
 * @swagger
 * tags:
 *   name: Stocks
 *   description: Stock management
 */
/**
 * @swagger
 * /stocks:
 *   get:
 *     summary: Retrieve a list of stocks
 *     tags: [Stocks]
 *     responses:
 *       200:
 *         description: A list of stocks
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
 *                     format: date-time
 *                   registrationDate:
 *                     type: string
 *                     format: date-time
 */
export const getStocks = async (req, res) => {
    const stocks = await prisma.stock.findMany();
    res.json(stocks);
};
/**
 * @swagger
 * /stocks/{id}:
 *   get:
 *     summary: Get a stock by ID
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The stock ID
 *     responses:
 *       200:
 *         description: The stock description by ID
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
 *                   format: date-time
 *                 registrationDate:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Stock not found
 */
export const getStockById = async (req, res) => {
    const { id } = req.params;
    const stock = await prisma.stock.findUnique({ where: { id: Number(id) } });
    if (!stock) {
        return res.status(404).json({ message: 'Stock not found' });
    }
    res.json(stock);
};
