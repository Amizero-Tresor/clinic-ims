// src/controllers/authController.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from "../../prisma/prisma-client";
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [ADMIN, MANAGER]
 *     responses:
 *       200:
 *         description: The user was successfully registered
 *       400:
 *         description: Bad request
 */
export const register = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password, type } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                password: hashedPassword,
                type,
            },
        });
        const token = jwt.sign({ userId: user.id, type: user.type }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return res.status(201).json({ token, user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
/**
 * @swagger
 * api/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Unauthorized
 */
export const login = async (req, res) => {
    const { email, password } = req.body;
    // console.log({email,password})
    try {
        console.log("email ", email);
        const user = await prisma.user.findUnique({
            where: { email },
        });
        console.log("email ", email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id, type: user.type }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return res.status(200).json({ token, user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
