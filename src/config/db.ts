import mongoose from "mongoose";
import dotenv from "dotenv";
// src/config/db.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

