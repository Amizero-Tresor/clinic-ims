import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
const authRoute = require("./src/routes/authRoute");
const employeeRoutes = require("./src/routes/employee")
const productRoutes = require("./src/routes/product");
const transactionRoutes = require("./src/routes/transaction");
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { setupSwagger } from './src/config/swagger';
const cors = require('cors');
 // Adjust import path if needed

dotenv.config();

// Swagger options
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Clinic IMS API",
            version: "1.0.0",
            description: "API documentation for Clinic Inventory Management System",
        },
    },
    apis: ["./src/controllers/*.ts"], // Ensure this path is correct for TypeScript files
};

const app = express();
setupSwagger(app);

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Middleware setup
app.use(express.json());
app.use(morgan("dev"));

app.use(cors({
    origin: ['http://localhost:5173', 'https://clinic-ims.vercel.app'], // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE', // Allow these HTTP methods
    credentials: true // If you need to send cookies with requests
  }));

// Default route
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the Clinic IMS API!');
});

// Swagger documentation route
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// API routes
app.use("/api/auth", authRoute);
app.use("/api/employees", employeeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
