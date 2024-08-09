const express = require('express')
const dotenv = require('dotenv')
const authRoute = require('./src/routes/authRoute')
const employeeRoutes = require('./src/routes/employee')
const productRoutes = require('./src/routes/product')
const transactionRoutes = require('./src/routes/transaction')
const morgan = require('morgan')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
import { setupSwagger } from './src/config/swagger';

dotenv.config();
const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Clinic IMS API",
        version: "1.0.0",
        description: "API documentation for Clinic Inventory Management System",
      },
    },
    apis: ["./src/controllers/*.ts"],
  };

const app = express();
setupSwagger(app);

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use(express.json());
app.use(morgan("dev"));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use("/api/auth", authRoute);
app.use("/api/employees", employeeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
