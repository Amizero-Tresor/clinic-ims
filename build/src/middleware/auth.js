import jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma-client";
import { UserType } from "@prisma/client";
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Using Prisma to find the user by ID
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }
            req.user = user; // Now TypeScript recognizes req.user
            next();
        }
        catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
export const admin = (req, res, next) => {
    if (req.user && req.user.type === UserType.ADMIN) {
        next();
    }
    else {
        res.status(401).json({ message: "Not authorized as an admin" });
    }
};
export const manager = (req, res, next) => {
    if (req.user && req.user.type === UserType.MANAGER) {
        next();
    }
    else {
        res.status(401).json({ message: "Not authorized as a manager" });
    }
};
