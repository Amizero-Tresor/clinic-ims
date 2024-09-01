import prisma from "../../prisma/prisma-client";
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 productName:
 *                   type: string
 *       500:
 *         description: Server error
 */
export const createProduct = async (req, res) => {
    const { productName } = req.body;
    try {
        const product = await prisma.product.create({
            data: {
                productName,
            },
        });
        return res.status(201).json(product);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product description by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 productName:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
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
 *       500:
 *         description: Server error
 */
export const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 productName:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { productName } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                productName,
            },
        });
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({
            where: { id: Number(id) },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
